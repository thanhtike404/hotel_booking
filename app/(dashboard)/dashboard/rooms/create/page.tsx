import Form from "next/form";
import { amenitiesList } from "@/data/aminities";
import { createRoom, hotels } from "./createRoom";

export default async function CreateRoomPage() {


    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6">Create Room</h1>

                <Form action={createRoom} className="space-y-6">
                    {/* Hotel Select */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Hotel</label>
                        <select
                            name="hotelId"
                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3"
                        >
                            <option value="">Select hotel</option>
                            {hotels.map((hotel) => (
                                <option key={hotel.id} value={hotel.id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Room Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Type</label>
                        <select
                            name="roomType"
                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3"
                        >
                            <option value="">Select room type</option>
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                            <option value="TWIN">Twin</option>
                            <option value="SUITE">Suite</option>
                            <option value="FAMILY">Family</option>
                        </select>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Rooms</label>
                            <input
                                type="number"
                                name="totalRooms"
                                min="1"
                                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Available Rooms</label>
                            <input
                                type="number"
                                name="availableRooms"
                                min="0"
                                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Room Image URL</label>
                        <input
                            type="url"
                            name="roomImage"
                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amenities</label>
                        <p className="text-sm text-gray-400 mb-2">
                            Select the amenities available at this hotel
                        </p>
                        <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                            {amenitiesList.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="amenities"
                                        value={amenity}
                                        className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600"
                                    />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white"
                        >
                            Create Room
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
