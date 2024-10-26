import React from 'react'
import { useQuery } from 'react-query'

function Dashboard() {
    const { data } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const res = await fetch('http://localhost:3000/')
            return res.json()
        }})
  return (
    <div>dashboard test: {data?.message}</div>
  )
}

export default Dashboard