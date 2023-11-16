"use client"

import { useEffect, useState } from 'react'
import { SkillDetailForm } from './skillForm'
import { useParams } from 'next/navigation';
import { getSkillById } from '@/lib/api/skillAPI';
import TextSkeleton from '@/app/dashboard/components/TextSkeleton';
import { withProtected } from '@/hooks/useAuth';

function Home() {
    const { skillId } = useParams()
    const [skill, setSkill] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const res = await getSkillById(+skillId);
                setSkill(res.data);
            } catch (err: any) {
                setError(`Error initializing the app: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, [skillId])

    return (
        <div className="hidden flex-col md:flex w-full">
            <div className="flex-1 space-y-4 px-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight pt-5">Edit skill: {skill.name}</h2>
                </div>
                {
                    !isLoading ? (
                        <SkillDetailForm skillParam={skill} />
                    ) : (
                        <TextSkeleton />
                    )
                }
            </div>
        </div>
    )
}
export default withProtected(Home)