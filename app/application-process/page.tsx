import { Metadata } from 'next'
import ApplicationHero from '@/components/application-process/application-hero'
import ApplicationSteps from '@/components/application-process/application-steps'
import ApplicationTimeline from '@/components/application-process/application-timeline'
import RequiredDocuments from '@/components/application-process/required-documents'
import ApplicationTips from '@/components/application-process/application-tips'
import CommonMistakes from '@/components/application-process/common-mistakes'
import SupportResources from '@/components/application-process/support-resources'
import ApplicationFaq from '@/components/application-process/application-faq'

export const metadata: Metadata = {
  title: 'Application Process | Graduate in Korea',
  description: 'Complete guide to applying to Korean universities for Uzbek students - step by step process, required documents, timeline, and expert tips.',
}

export default function ApplicationProcessPage() {
  return (
    <main className="min-h-screen">
      <ApplicationHero />
      <ApplicationSteps />
      <ApplicationTimeline />
      <RequiredDocuments />
      <ApplicationTips />
      <CommonMistakes />
      <SupportResources />
      <ApplicationFaq />
    </main>
  )
}
