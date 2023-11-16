"use client"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deleteDietDetailById, getDietDetailByDietId, getDietDetailById } from '@/lib/api/DietDetailAPI';
import ConfirmationDialog from './confirm';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { DataTable } from '../component/data-table';
import DataTableSkeleton from '@/app/dashboard/components/DataTableSkeleton';
import { columns } from '../component/columns';
import { toast } from '@/components/ui/use-toast';
interface Event {
    title: string;
    start: Date;
    startTime: string;
    allDay: boolean;
    id: number;
    daysOfWeek: string[]
    food: string,
    quantity: number
}
interface DietDetail {
    id: number,
    name: string,
    description: string,
    createAt: Date,
    updateAt: Date,
    scheduleAt: Date,
    endAt: Date,
    feedingDateArray: string[],
    feedingTime: Date,
    quantity: number,
    status: boolean,
    foodId: number,
    food: {
        name: string,
        imageUrl: string,
    }
}

export default function DietDetailViewPage() {
    const [dietDetails, setDietDetails] = useState<DietDetail[]>([])
    const { dietId } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const [target, setTarget] = useState<DietDetail>()

    useEffect(() => {
        const initialize = async () => {
            try {
                const res = await getDietDetailByDietId(+dietId);
                const { data } = res;
                if (data == null) return
                setDietDetails(data);
            } catch (err: any) {
                setError(`Error initializing the app: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, [dietId])
    const events = dietDetails.map((dietDetail: DietDetail) => (
        {
            id: dietDetail.id,
            title: dietDetail.name,
            start: dietDetail.scheduleAt,
            startTime: dietDetail.feedingTime.toString(),
            daysOfWeek: dietDetail.feedingDateArray,
            food: dietDetail.food.name
        }
    )) as Event[]
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleNavigate = () => {
        setIsDialogOpen(true);
    };

    const handleEdit = () => {
        if (target == null) {
            toast({
                title: "Edit Error",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-light">Target is null</code>
                    </pre>
                )
            })
            return;
        }
        setIsDialogOpen(false);
        router.push(`/dashboard/diets/${dietId}/${target.id}/edit`)
    };
    const handleDelete = () => {
        setIsDialogOpen(false);
        if (target == null) {
            toast({
                title: "Delete Error",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-light">Target is null</code>
                    </pre>
                )
            })
            return;
        }
        deleteDietDetailById(target.id)
            .then((response) => {
                toast({
                    title: "Delete successfully",
                })
                setIsLoading(false);
            })
            .catch((error) => {
                toast({
                    title: "Delete Error",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-light">{JSON.stringify(error.message, null, 2)}</code>
                        </pre>
                    )
                })
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <Tabs defaultValue="List" className="w-full">
                <TabsList className="grid w-[400px] grid-cols-2 ml-auto">
                    <TabsTrigger value="Calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="List">List</TabsTrigger>
                </TabsList>
                <TabsContent value="Calendar">
                    <Card>
                        <CardContent className="">
                            <div className="hidden flex-col md:flex w-full py-5">
                                {
                                    isLoading ? (
                                        <DataTableSkeleton />
                                    ) : (
                                        <FullCalendar
                                            plugins={[
                                                dayGridPlugin,
                                                interactionPlugin,
                                                timeGridPlugin
                                            ]}
                                            headerToolbar={{
                                                left: 'prev,next today',
                                                center: 'title',
                                                right: 'dayGridMonth,timeGridWeek'
                                            }}
                                            events={
                                                function (info, successCallback, failureCallback) {
                                                    successCallback(
                                                        events.map(function (eventEl) {
                                                            return {
                                                                id: eventEl.id.toString(),
                                                                title: eventEl.title,
                                                                start: eventEl.start,
                                                                startTime: eventEl.startTime,
                                                                daysOfWeek: eventEl.daysOfWeek
                                                            }
                                                        }))
                                                }
                                            }
                                            eventClick={function (info) {
                                                handleNavigate();
                                                setTarget(dietDetails.find((detail) => detail.id == Number(info.event.id)))
                                            }}
                                            aspectRatio={1.5}
                                            slotMinTime={'04:00:00'}
                                            slotMaxTime={'24:00:00'}
                                            expandRows={true}
                                            fixedWeekCount={false}
                                            displayEventEnd={true}
                                            nowIndicator={true}
                                            editable={false}
                                            droppable={true}
                                            selectable={false}
                                            selectMirror={false}
                                            selectOverlap={true}
                                        />)}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="List">
                    <Card>
                        <CardContent className="space-y-2">
                            <div className="hidden flex-col md:flex w-full py-5">

                                <div className="flex-1 space-y-4">
                                    {
                                        isLoading ? (
                                            <DataTableSkeleton />
                                        ) : (
                                            <DataTable columns={columns} data={dietDetails} />
                                        )
                                    }
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <ConfirmationDialog
                isOpen={isDialogOpen}
                message={target}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCancel={handleCancel} />
        </div>
    )
}