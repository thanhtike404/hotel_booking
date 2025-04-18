'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Room } from '@/types/rooms'

const formSchema = z.object({
    checkIn: z.date({
        required_error: 'Check-in date is required',
    }),
    checkOut: z.date({
        required_error: 'Check-out date is required',
    }),
    guests: z
        .number({
            required_error: 'Number of guests is required',
        })
        .min(1, 'At least 1 guest is required'),
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(5, 'Phone number is required'),
})

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room;
    hotelId: string;
    hotelName: string;
}

export default function BookingModal({
    isOpen,
    onClose,
    room,
    hotelId,
    hotelName
}: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Set up the form with default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: new Date(),
            checkOut: addDays(new Date(), 1),
            guests: room?.available || 2,
            name: '',
            email: '',
            phone: '',
        },
    })

    // Reset form when modal opens with a new room
    useEffect(() => {
        if (isOpen && room) {
            form.reset({
                checkIn: new Date(),
                checkOut: addDays(new Date(), 1),
                guests: room.maxOccupancy || 2,
                name: '',
                email: '',
                phone: '',
            })
            setError('')
            setSuccess(false)
        }
    }, [isOpen, room, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError('')

            // Calculate number of nights for the booking
            const checkIn = new Date(values.checkIn)
            const checkOut = new Date(values.checkOut)
            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

            // Create booking payload
            const bookingData = {
                hotelId,
                roomId: room.id,
                roomName: room.name,
                hotelName,
                checkIn: values.checkIn.toISOString(),
                checkOut: values.checkOut.toISOString(),
                guests: values.guests,
                customerName: values.name,
                customerEmail: values.email,
                customerPhone: values.phone,
                totalPrice: room.price * nights,
                nights
            }

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create booking')
            }

            setSuccess(true)

            // Close modal after showing success message
            setTimeout(() => {
                onClose()

            }, 2000)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create booking')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book {room?.name || 'Room'}</DialogTitle>
                </DialogHeader>

                {success ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-md">
                        <h3 className="font-semibold">Booking Successful!</h3>
                        <p>Your reservation has been confirmed. Redirecting...</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-md mb-4">
                                <h3 className="font-semibold">{hotelName}</h3>
                                <p className="text-sm">{room?.name} - ${room?.price} per night</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="checkIn"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Check-in Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal',
                                                                !field.value && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date('1900-01-01')
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="checkOut"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Check-out Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal',
                                                                !field.value && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date <= form.getValues().checkIn ||
                                                            date < new Date('1900-01-01')
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="guests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Guests</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={room.maxOccupancy || 10}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your contact number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Price calculation summary */}
                            {form.watch("checkIn") && form.watch("checkOut") && (
                                <div className="bg-muted/50 p-4 rounded-md">
                                    <h4 className="font-medium">Booking Summary</h4>
                                    <div className="text-sm mt-2 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Room:</span>
                                            <span>{room?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Price per night:</span>
                                            <span>${room?.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Number of nights:</span>
                                            <span>
                                                {Math.ceil(
                                                    (new Date(form.watch("checkOut")).getTime() -
                                                        new Date(form.watch("checkIn")).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-medium pt-2 border-t mt-2">
                                            <span>Total:</span>
                                            <span>
                                                ${(room?.price) *
                                                    Math.ceil(
                                                        (new Date(form.watch("checkOut")).getTime() -
                                                            new Date(form.watch("checkIn")).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Confirm Booking'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}