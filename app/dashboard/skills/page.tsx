"use client"

import { columns } from "@/app/dashboard/skills/components/columns";
import { DataTable } from "@/app/dashboard/skills/components/data-table";
import { Button } from "@/components/ui/button";
import DataTableSkeleton from '../components/DataTableSkeleton'
import Link from 'next/link';
import { useState, useEffect } from 'react'
import { withProtected } from "@/hooks/useAuth";
import { getSkills } from "@/lib/api/skillAPI";

function UserManagementPage() {
    const [skills, setSkills] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const res = await getSkills();
                setSkills(res.data);
            } catch (err: any) {
                setError(`Error initializing the app: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, [])

    return (
        <div className="hidden flex-col md:flex w-full">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Skill Management</h2>
                    <Link href="/dashboard/skills/create">
                        <Button variant="default">
                            Create
                        </Button>
                    </Link>
                </div>
                <div className="flex-1 space-y-4">
                    {
                        isLoading ? (
                            <DataTableSkeleton />
                        ) : (
                            <DataTable columns={columns} data={skills} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default withProtected(UserManagementPage)