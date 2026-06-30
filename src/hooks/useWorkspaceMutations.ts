import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addCaseworkerAssignmentFn,
  addConcreteServiceFn,
  addNoteFn,
  createEnrollmentFn,
  createCaseFromIntakeFn,
  editNoteFn,
  removeCaseworkerAssignmentFn,
  setPrimaryCaseworkerFn,
  updateCaseStatusFn,
  updateEnrollmentFn,
  updateIntakeFieldFn,
} from '~/fns/workspace'
import { WorkspaceQueries } from '~/queries/workspace'
import type {
  AddCaseworkerAssignmentInput,
  AddConcreteServiceRecordInput,
  AddNoteRecordInput,
  AssignmentByStaffInput,
  CreateCaseFromIntakeInput,
  CreateEnrollmentInput,
  EditNoteRecordInput,
  UpdateCaseStatusInput,
  UpdateEnrollmentInput,
  UpdateIntakeFieldInput,
} from '~/schema/workspace'

function useInvalidateWorkspace() {
  const queryClient = useQueryClient()

  return () =>
    queryClient.invalidateQueries({
      queryKey: WorkspaceQueries.all(),
    })
}

export function useUpdateCaseStatusMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: UpdateCaseStatusInput) =>
      updateCaseStatusFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useUpdateEnrollmentMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: UpdateEnrollmentInput) =>
      updateEnrollmentFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useAddCaseworkerAssignmentMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (
      variables: AddCaseworkerAssignmentInput,
    ) => addCaseworkerAssignmentFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useCreateEnrollmentMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: CreateEnrollmentInput) =>
      createEnrollmentFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useRemoveCaseworkerAssignmentMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (
      variables: AssignmentByStaffInput,
    ) => removeCaseworkerAssignmentFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useSetPrimaryCaseworkerMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (
      variables: AssignmentByStaffInput,
    ) => setPrimaryCaseworkerFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useUpdateIntakeFieldMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: UpdateIntakeFieldInput) =>
      updateIntakeFieldFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useAddNoteMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: AddNoteRecordInput) =>
      addNoteFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useEditNoteMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (variables: EditNoteRecordInput) =>
      editNoteFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useAddConcreteServiceMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (
      variables: AddConcreteServiceRecordInput,
    ) => addConcreteServiceFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}

export function useCreateCaseFromIntakeMutation() {
  const invalidateWorkspace = useInvalidateWorkspace()

  return useMutation({
    mutationFn: (
      variables: CreateCaseFromIntakeInput,
    ) => createCaseFromIntakeFn({ data: variables }),
    onSettled: invalidateWorkspace,
  })
}
