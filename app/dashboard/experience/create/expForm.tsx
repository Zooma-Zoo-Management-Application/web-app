"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { createDiet } from "@/lib/api/dietAPI"

const formDetailSchema = z.object({
    name: z.string()
        .min(3, { message: 'Name must be at least 3 characters.' }),
    description: z.string()
        .min(3, { message: 'Description must be at least 3 characters.' }),
    yearOfExperience: z.number().nullish(),
    userId: z.number(),
    skillId: z.number(),
})


type FormDetailValues = z.infer<typeof formDetailSchema>

export function SkillDetailForm() {
    const router = useRouter()
    const [date, setDate] = useState<Date>()

    const defaultValues: Partial<FormDetailValues> = {
        name: "",
        description: "",
    }

    const form = useForm<FormDetailValues>({
        resolver: zodResolver(formDetailSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(values: FormDetailValues) {
        console.log("submit")
        let dietBody: any = {
            name: values.name,
            description: values.description,
        };
        //createDiet(dietBody)
        toast({
            variant: "default",
            description: (
                <span className="text-l font-bold text-green-500">
                    Create Successfully!
                </span>
            ),
        })
        router.push("/dashboard/diets")
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of diet detail" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Diet's description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full hover:shadow-primary-md">Create Diet</Button>
            </form>
        </Form>
    )
}