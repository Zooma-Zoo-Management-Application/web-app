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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import FirebaseService from "@/lib/FirebaseService"
import { updateType } from "@/lib/api/typeAPI"
import { isBase64Image } from "@/lib/utils"
import { getDownloadURL, ref, uploadBytes, } from "firebase/storage"
import Image from "next/image"
import { ChangeEvent, useState } from "react"

const UpdateValidation = z.object({
  name: z.string(),
  description: z.string()
    .min(10, "Description must be at least 10 characters long"),
  imageUrl: z.string(),
});


type UpdateFormValues = z.infer<typeof UpdateValidation>



export function UpdateForm({id, values, setOpen}: any) {
  const [files, setFiles] = useState<File[]>([]);

  const defaultValues: Partial<UpdateFormValues> = {
    name: values?.name,
    description: values?.description,
    imageUrl: values?.imageUrl,
  }

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(UpdateValidation),
    defaultValues,
    mode: "onChange",
  })

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      setFiles(Array.from(e.target.files));

      if(!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      }

      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: UpdateFormValues) {
    const blob = values.imageUrl;

    const hasImageChanged = isBase64Image(blob);

    if(hasImageChanged) {
      // const imgRes = await startUpload(files);
      const imageRef = ref(FirebaseService.storage, `images/animal-types/${id}`);
      uploadBytes(imageRef, files[0]).then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            values.imageUrl = url;
            updateType(id, {
              "name": values.name,
              "description": values.description,
              "imageUrl": values.imageUrl
            })
            .then((res) => {
              toast({
                title: "Animal type updated",
                description: "Animal type has been updated successfully.",
              });
              setOpen(false);
            })
          })
          .catch((error) => {
            console.log(error);
            values.imageUrl = "";
          });
      });
    } else {
      updateType(id, {
        "name": values.name,
        "description": values.description,
        "imageUrl": values.imageUrl
      })
      .then((res) => {
        toast({
          title: "Animal type updated",
          description: "Animal type has been updated successfully.",
        });
        setOpen(false);
      })
    }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                    <Image
                      src={
                          field.value
                      }
                      alt="profile photo"
                      width={100}
                      height={100}
                      priority
                      className="rounded-full object-cover h-full w-full"
                    />
                  ) : (
                    <Image
                      src= "/Zooma_Logo.svg"
                      alt="profile photo"
                      width={100}
                      height={100}
                      priority
                      className="object-contain"
                    />
                  )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-500">
                <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo" 
                  className="account-form_image-input"
                  onChange={e => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
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
                  <Textarea rows={10} placeholder="Animal Types" {...field} />
                </FormControl>
                <FormDescription>
                  This is animal type description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit">Update type</Button>
      </form>
    </Form>
  )
}