export interface Video {
    id: string;
    user_id: string;
    script_id?: string;
    product_id?: string;
    template_id?: string;
    video_url: string; // URL from Storage
    status: 'draft' | 'processing' | 'ready' | 'uploaded' | 'failed';
    tiktok_video_id?: string;
    created_at: string;
}

export interface IVideoRepository {
    getVideos(userId: string): Promise<Video[]>;
    getVideoById(id: string): Promise<Video | null>;
    createVideo(video: Partial<Video>): Promise<Video>; // Usually after upload
    updateVideoStatus(id: string, status: Video['status'], tiktokId?: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
}
