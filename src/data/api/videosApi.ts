import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Video } from '@/domain/entities/Video';
import { VideoRepositoryImpl } from '@/data/repositories/VideoRepository';
import { GeminiAIService } from '@/data/services/GeminiAIService';
import { supabase } from '@/data/supabaseClient';

const videoRepo = new VideoRepositoryImpl();

export const videosApi = createApi({
    reducerPath: 'videosApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Videos'],
    endpoints: (builder) => ({
        getVideos: builder.query<Video[], string>({
            queryFn: async (userId) => {
                try {
                    const data = await videoRepo.getVideos(userId);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Videos'],
        }),

        generateVideoPrompt: builder.mutation<string, { scriptContent: string }>({
            queryFn: async ({ scriptContent }) => {
                try {
                    const key = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
                    if (!key) throw new Error('API Key missing');
                    const aiService = new GeminiAIService(key);

                    const prompt = await aiService.generateVideoPrompt(scriptContent);
                    return { data: prompt };
                } catch (error: any) {
                    return { error: error.message };
                }
            }
        }),

        saveVideo: builder.mutation<Video, Partial<Video>>({
            queryFn: async (video) => {
                try {
                    const data = await videoRepo.createVideo(video);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Videos'],
        }),

        uploadVideoFile: builder.mutation<string, { file: File, userId: string }>({
            queryFn: async ({ file, userId }) => {
                try {
                    // Direct Supabase Storage Upload
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${userId}/${Math.random()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('videos') // Requires 'videos' bucket to exist
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('videos')
                        .getPublicUrl(filePath);

                    return { data: publicUrl };
                } catch (error: any) {
                    return { error: error.message };
                }
            }
        }),

        deleteVideo: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    await videoRepo.deleteVideo(id);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Videos'],
        }),
    }),
});

export const {
    useGetVideosQuery,
    useGenerateVideoPromptMutation,
    useSaveVideoMutation,
    useUploadVideoFileMutation,
    useDeleteVideoMutation
} = videosApi;
