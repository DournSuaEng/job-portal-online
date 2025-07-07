import { getPieGraphicCompaniesCreatedByUser, getPieGraphicJobCreatedByUser, getTotalCompaniesOnPortal, getTotalCompaniesOnPortalByUserId, getTotalJobsOnPortal, getTotalJobsOnPortalByUserId } from '@/actions/get-overview-analytics'
import Box from '@/components/box'
import { OverviewPieChart } from '@/components/overview-pie-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth } from '@clerk/nextjs/server'
import { BriefcaseBusiness, Building2, UserRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardAnalyticsPage =async () => {
  const {userId } = await auth();
  if(!userId){
    redirect("/")
  }
  const totalJobsOnPortal = await getTotalJobsOnPortal()
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId)
  const totalCompaniesOnPortal = await getTotalCompaniesOnPortal()
  const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(userId)

  const graphicJobsTotal = await getPieGraphicJobCreatedByUser(userId)
  const graphicCompaniesTotal = await getPieGraphicCompaniesCreatedByUser(userId)
  return (
    <Box className='flex-col items-start p-4'>
      <div className='flex flex-col items-start'>
        <h2 className='font-sans tracking-wider font-bold text-2xl'>
          Dashboard
        </h2>
        <p className='text-sm text-muted-foreground'>
          Overview of your account
        </p>
      </div>

      <Separator className='my-4' />

      <div className='grid gap-4 w-full grid-cols-1 md:grid-cols-4'>
        {/* Total jobs on the portal */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Total Jobs</CardTitle>
            <BriefcaseBusiness className='w-4 h-4' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totalJobsOnPortal}</CardContent>
        </Card>

        {/* Total jobs posted by the user */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Total Jobs By User</CardTitle>
           <UserRound className="w-4 h-4" />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totalJobsOnPortalByUser}</CardContent>
        </Card>

        {/* Total companies on the portal */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Total Companies</CardTitle>
            <Building2 className="w-4 h-4" />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totalCompaniesOnPortal}</CardContent>
        </Card>

        {/* Total companies by user */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Total Companies By User</CardTitle>
            <Building2 className="w-4 h-4" />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totalCompaniesOnPortalByUser}</CardContent>
        </Card>
        {/* month wise jobs count */}
         <Card className='col-span-1 md:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Month Wise Jobs Count</CardTitle>
            <BriefcaseBusiness className='w-4 h-4' />
          </CardHeader>
          <CardContent className='text-2xl font-bold'>
              <OverviewPieChart data={graphicJobsTotal} />
          </CardContent>
          
        </Card>
        {/* month wise companies count */}
         <Card className='col-span-1 md:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Month Wise Companies Count</CardTitle>
          <Building2 className="w-4 h-4" />
          </CardHeader>
         <CardContent className='text-2xl font-bold'>
              <OverviewPieChart data={graphicCompaniesTotal} />
          </CardContent>
        </Card>
      </div>
    </Box>
  )
}

export default DashboardAnalyticsPage
