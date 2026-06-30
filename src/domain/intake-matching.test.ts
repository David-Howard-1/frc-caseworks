import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { ClientCase, Person, Program, Staff } from '~/domain/workspace'
import { findPersonIntakeMatches } from './intake-matching'

const programs: Program[] = [
  {
    id: 10,
    frcId: 1,
    code: 'FSS',
    name: 'Family Support',
    grantor: 'Demo',
    color: '#1C5380',
  },
]

const staff: Staff[] = [
  {
    id: 20,
    frcId: 1,
    name: 'Case Worker',
    role: 'Caseworker',
    programs: [10],
  },
]

const people: Person[] = [
  {
    id: 1,
    frcId: 1,
    role: 'client',
    firstName: 'Jordan',
    lastName: 'Rivera',
    phone: '555-111-2222',
  },
  {
    id: 2,
    frcId: 1,
    role: 'client',
    firstName: 'Casey',
    lastName: 'Open',
    email: 'casey@example.org',
  },
  {
    id: 3,
    frcId: 1,
    role: 'client',
    firstName: 'Riley',
    lastName: 'Closed',
    dateOfBirth: '2010-01-02',
  },
]

const cases: ClientCase[] = [
  {
    id: 100,
    personId: 2,
    displayName: 'Casey Open',
    age: 12,
    status: 'Open',
    opened: '2026-01-01',
    lastContact: '2026-02-01',
    risk: 'Low',
    county: 'Jefferson',
    intake: { intakeDate: '2026-01-01' },
    enrollments: [
      {
        id: 200,
        programId: 10,
        caseworkers: [{ staffId: 20, isPrimary: true }],
        status: 'Active',
        opened: '2026-01-01',
        target: '2026-06-01',
        goal: 'Stability',
      },
    ],
    relatedPeople: [],
  },
  {
    id: 101,
    personId: 3,
    displayName: 'Riley Closed',
    age: 16,
    status: 'Closed',
    opened: '2025-01-01',
    lastContact: '2025-03-01',
    risk: 'Low',
    county: 'Jefferson',
    intake: { intakeDate: '2025-01-01' },
    enrollments: [],
    relatedPeople: [],
  },
]

describe('findPersonIntakeMatches', () => {
  it('finds people without cases', () => {
    const matches = findPersonIntakeMatches({
      cases,
      input: { firstName: 'Jordan', lastName: '' },
      people,
      programs,
      staff,
    })

    assert.equal(matches[0]?.action, 'start_intake')
    assert.equal(matches[0]?.personId, 1)
    assert.equal(matches[0]?.programArea, 'No case')
  })

  it('finds people with open cases and returns view-case action data', () => {
    const matches = findPersonIntakeMatches({
      cases,
      input: { firstName: '', lastName: '', email: 'casey@example.org' },
      people,
      programs,
      staff,
    })

    assert.equal(matches[0]?.action, 'view_case')
    assert.equal(matches[0]?.caseId, 100)
    assert.equal(matches[0]?.caseStatus, 'Open')
  })

  it('finds people with closed cases and returns re-intake action data', () => {
    const matches = findPersonIntakeMatches({
      cases,
      input: { firstName: '', lastName: '', dateOfBirth: '2010-01-02' },
      people,
      programs,
      staff,
    })

    assert.equal(matches[0]?.action, 'reintake')
    assert.equal(matches[0]?.caseId, 101)
    assert.equal(matches[0]?.caseStatus, 'Closed')
  })

  it('does not return matches for empty searches', () => {
    const matches = findPersonIntakeMatches({
      cases,
      input: { firstName: '', lastName: '' },
      people,
      programs,
      staff,
    })

    assert.deepEqual(matches, [])
  })
})
