"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

function locationFilter() {
    const { data } = useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const response = await axios.get('/api/locations')
            return response.data
        }
    })
    return (
        <div>locationFilter</div>
    )
}

export default locationFilter