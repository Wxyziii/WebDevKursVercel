// ========================================
// DATABASE SERVICE (Supabase)
// ========================================

// ⚠️ KONFIGURER DISSE VERDIENE FRA SUPABASE DASHBOARD:
// Settings → API → Project URL og anon key
const SUPABASE_URL = 'https://advrfjmjwlqupdulsvul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdnJmam1qd2xxdXBkdWxzdnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODU4MzEsImV4cCI6MjA4NjM2MTgzMX0.pjHX7wk5PoZV8EXncURwbpMhOwc_oyQ4QggB68kL1oA';

// Import Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class DatabaseService {
    constructor() {
        this.client = supabaseClient;
    }

    // ========================================
    // USER METHODS
    // ========================================

    async createUser(name, email, password) {
        // Check if this is the admin account
        const isAdmin = email.toLowerCase() === 'admin@kurs.no';
        
        // Create auth user in Supabase
        const { data: authData, error: authError } = await this.client.auth.signUp({
            email: email.toLowerCase(),
            password: password
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                throw new Error('En bruker med denne e-posten finnes allerede');
            }
            throw new Error(authError.message);
        }

        // Create user profile in users table
        const { data: user, error: profileError } = await this.client
            .from('users')
            .insert({
                id: authData.user.id,
                name: name,
                email: email.toLowerCase(),
                is_admin: isAdmin,
                part1_completed: false,
                part2_completed: false,
                is_flagged: false,
                flag_reason: null,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }

        return this.formatUser(user);
    }

    async loginUser(email, password) {
        const { data, error } = await this.client.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
        });

        if (error) {
            throw new Error('Feil e-post eller passord');
        }

        // Get user profile
        const user = await this.getUserById(data.user.id);
        if (!user) {
            throw new Error('Brukerprofil ikke funnet');
        }

        return user;
    }

    async getUserByEmail(email) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !data) return null;
        return this.formatUser(data);
    }

    async getUserById(id) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.formatUser(data);
    }

    async updateUser(id, updates) {
        const dbUpdates = {};
        if (updates.part1Completed !== undefined) dbUpdates.part1_completed = updates.part1Completed;
        if (updates.part2Completed !== undefined) dbUpdates.part2_completed = updates.part2Completed;
        if (updates.isFlagged !== undefined) dbUpdates.is_flagged = updates.isFlagged;
        if (updates.flagReason !== undefined) dbUpdates.flag_reason = updates.flagReason;

        const { data, error } = await this.client
            .from('users')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.formatUser(data);
    }

    formatUser(dbUser) {
        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            isAdmin: dbUser.is_admin,
            part1Completed: dbUser.part1_completed,
            part2Completed: dbUser.part2_completed,
            isFlagged: dbUser.is_flagged,
            flagReason: dbUser.flag_reason,
            createdAt: dbUser.created_at
        };
    }

    async flagUser(userId, reason) {
        return this.updateUser(userId, { isFlagged: true, flagReason: reason });
    }

    // ========================================
    // COMPLETION/LEADERBOARD METHODS
    // ========================================

    async saveCompletion(userId, completionData) {
        const { data, error } = await this.client
            .from('completions')
            .insert({
                user_id: userId,
                part1_time: completionData.part1Time,
                part2_time: completionData.part2Time,
                total_time: completionData.totalTime,
                is_flagged: completionData.isFlagged || false,
                flag_reason: completionData.flagReason || null,
                cheat_score: completionData.cheatScore || 0,
                completed_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async getLeaderboard(limit = 50) {
        const { data, error } = await this.client
            .from('completions')
            .select(`
                *,
                users (name, is_flagged)
            `)
            .order('total_time', { ascending: true })
            .limit(limit);

        if (error) throw new Error(error.message);

        return data.map(entry => ({
            id: entry.id,
            userId: entry.user_id,
            userName: entry.users?.name || 'Ukjent',
            part1Time: entry.part1_time,
            part2Time: entry.part2_time,
            totalTime: entry.total_time,
            isFlagged: entry.is_flagged || entry.users?.is_flagged,
            flagReason: entry.flag_reason,
            cheatScore: entry.cheat_score,
            completedAt: entry.completed_at
        }));
    }

    async getUserCompletion(userId) {
        const { data, error } = await this.client
            .from('completions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) return null;
        return {
            id: data.id,
            userId: data.user_id,
            part1Time: data.part1_time,
            part2Time: data.part2_time,
            totalTime: data.total_time,
            isFlagged: data.is_flagged,
            completedAt: data.completed_at
        };
    }

    // ========================================
    // PROJECT METHODS
    // ========================================

    async saveProject(userId, projectData) {
        // Check if user already has a public project
        if (projectData.isPublic) {
            const hasPublic = await this.hasPublicProject(userId);
            if (hasPublic) {
                throw new Error('Du kan bare ha ett offentlig prosjekt. Slett det gamle først.');
            }
        }

        const { data, error } = await this.client
            .from('projects')
            .insert({
                user_id: userId,
                title: projectData.title,
                html: projectData.html,
                css: projectData.css,
                js: projectData.js || null,
                part: projectData.part,
                is_public: projectData.isPublic || false,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.formatProject(data);
    }

    async updateProject(projectId, projectData) {
        const updates = {
            title: projectData.title,
            html: projectData.html,
            css: projectData.css,
            is_public: projectData.isPublic,
            updated_at: new Date().toISOString()
        };
        if (projectData.js !== undefined) updates.js = projectData.js;

        const { data, error } = await this.client
            .from('projects')
            .update(updates)
            .eq('id', projectId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.formatProject(data);
    }

    async hasPublicProject(userId) {
        const { data, error } = await this.client
            .from('projects')
            .select('id')
            .eq('user_id', userId)
            .eq('is_public', true)
            .limit(1);

        return data && data.length > 0;
    }

    async getPublicProjects(limit = 50) {
        const { data, error } = await this.client
            .from('projects')
            .select(`
                *,
                users (name)
            `)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);

        return data.map(p => ({
            ...this.formatProject(p),
            userName: p.users?.name || 'Ukjent'
        }));
    }

    async getUserProjects(userId) {
        const { data, error } = await this.client
            .from('projects')
            .select('*')
            .eq('user_id', userId);

        if (error) throw new Error(error.message);
        return data.map(p => this.formatProject(p));
    }

    async getProjectById(id) {
        const { data, error } = await this.client
            .from('projects')
            .select(`
                *,
                users (name)
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return {
            ...this.formatProject(data),
            userName: data.users?.name || 'Ukjent'
        };
    }

    formatProject(dbProject) {
        return {
            id: dbProject.id,
            userId: dbProject.user_id,
            title: dbProject.title,
            html: dbProject.html,
            css: dbProject.css,
            js: dbProject.js,
            part: dbProject.part,
            isPublic: dbProject.is_public,
            createdAt: dbProject.created_at,
            updatedAt: dbProject.updated_at
        };
    }

    // ========================================
    // ADMIN METHODS
    // ========================================

    async deleteProject(projectId) {
        const { error } = await this.client
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw new Error(error.message);
        return true;
    }

    async deleteCompletion(completionId) {
        const { error } = await this.client
            .from('completions')
            .delete()
            .eq('id', completionId);

        if (error) throw new Error(error.message);
        return true;
    }

    async deleteUser(userId) {
        // Delete user's completions
        await this.client
            .from('completions')
            .delete()
            .eq('user_id', userId);

        // Delete user's projects
        await this.client
            .from('projects')
            .delete()
            .eq('user_id', userId);

        // Delete user profile
        const { error } = await this.client
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw new Error(error.message);
        return true;
    }

    async getAllUsers() {
        const { data, error } = await this.client
            .from('users')
            .select('*');

        if (error) throw new Error(error.message);
        return data.map(u => this.formatUser(u));
    }

    // ========================================
    // ACTIVITY TRACKING METHODS
    // ========================================

    async logActivity(userId, sessionId, activityType, activityData) {
        const { error } = await this.client
            .from('activity')
            .insert({
                user_id: userId,
                session_id: sessionId,
                activity_type: activityType,
                data: activityData,
                timestamp: new Date().toISOString()
            });

        // Don't throw on activity logging errors
        if (error) console.warn('Activity logging failed:', error);
    }

    async getSessionActivity(sessionId) {
        const { data, error } = await this.client
            .from('activity')
            .select('*')
            .eq('session_id', sessionId);

        if (error) return [];
        return data;
    }
}

// Create global instance
const db = new DatabaseService();
