import { supabase } from '@/data/supabaseClient';
import { IVideoRepository, Video } from '@/domain/entities/Video';

export class VideoRepositoryImpl implements IVideoRepository {
    async getVideos(userId: string): Promise<Video[]> {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data as Video[];
    }

    async getVideoById(id: string): Promise<Video | null> {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data as Video;
    }

    async createVideo(video: Partial<Video>): Promise<Video> {
        const { data, error } = await supabase
            .from('videos')
            .insert(video)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Video;
    }

    async updateVideoStatus(id: string, status: Video['status'], tiktokId?: string): Promise<void> {
        const updateData: any = { status };
        if (tiktokId) updateData.tiktok_video_id = tiktokId;

        const { error } = await supabase
            .from('videos')
            .update(updateData)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async deleteVideo(id: string): Promise<void> {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
