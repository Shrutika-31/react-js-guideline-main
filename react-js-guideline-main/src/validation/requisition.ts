import * as yup from 'yup';

export const requisitionSchema = yup.object({
  jobTitle: yup.string().trim().required('Job title is required'),
  jobLevel: yup.string().trim().required('Job level is required'),
  jobType: yup.string().trim().required('Job type is required'),
  location: yup.string().trim().required('Location is required'),
  priority: yup.string().trim().required('Priority is required'),
  description: yup.string().trim().required('Job description is required'),
  hiringJustification: yup.string().trim().required('Hiring justification is required'),
});

export type RequisitionValidation = yup.InferType<typeof requisitionSchema>;


