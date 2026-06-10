/// <reference types="vite/client" />

import '@mantine/core/styles.css'
import '../styles/app.css'

import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
} from '@mantine/core'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AppFrame } from '~/components/AppFrame'
import { DemoWorkspaceProvider } from '~/context/DemoWorkspaceContext'

const theme = createTheme({
  primaryColor: 'frcBlue',
  colors: {
    frcBlue: [
      '#eaf4fb',
      '#cfe4f2',
      '#a1c8df',
      '#70aaca',
      '#4a91b8',
      '#307fac',
      '#246f9e',
      '#1c5380',
      '#18476d',
      '#123957',
    ],
  },
  defaultRadius: 6,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'FRC CaseWorks' },
      {
        name: 'description',
        content:
          'FRC CaseWorks case management demo for multi-program family resource centers.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <MantineProvider theme={theme}>
        <DemoWorkspaceProvider>
          <AppFrame>
            <Outlet />
          </AppFrame>
        </DemoWorkspaceProvider>
      </MantineProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
