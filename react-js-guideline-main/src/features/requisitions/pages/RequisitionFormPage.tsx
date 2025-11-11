import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhanceTextWithAI } from '../../../services/openai';
import { fetchJobLevels, fetchRequisitionEnums } from '../../../services/requisitions';
import type { JobLevelOption } from '../../../types/requisitions';
import { createRequisition } from '../../../services/requisitionStore';
import { requisitionSchema } from '../../../validation/requisition';

interface RequisitionFormState {
	jobTitle: string;
	location: string;
	hiringManager: string;
	employmentType: string;
	headcount: number | '';
	budget: number | '';
	openDate: string;
	closeDate: string;
	description: string;
	// new fields to mirror wireframe
	jobLevel?: string;
	jobType?: string;
	numOpenings?: number | '';
	startDate?: string;
	priority?: string;
	requiredSkills?: string;
	preferredSkills?: string;
	experienceRange?: string;
	educationQualification?: string;
	salaryRange?: string;
	hiringJustification?: string;
	isReplacement?: string;
	previousEmployeeName?: string;
	expectedDuration?: string;
	approver1?: string;
	approver2?: string;
	approver3?: string;
}

export default function RequisitionFormPage(): JSX.Element {
    const navigate = useNavigate();
    const [form, setForm] = useState<RequisitionFormState>({
        jobTitle: '',
        location: '',
        hiringManager: '',
        employmentType: 'Full-time',
        headcount: '',
        budget: '',
        openDate: '',
        closeDate: '',
        description: '',
        jobLevel: '',
        jobType: '',
        numOpenings: 1,
        startDate: '',
        priority: 'Medium',
        requiredSkills: '',
        preferredSkills: '',
        experienceRange: '',
        educationQualification: '',
        salaryRange: '',
        hiringJustification: '',
        isReplacement: 'New',
        previousEmployeeName: '',
        expectedDuration: '',
        approver1: '',
        approver2: '',
        approver3: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

	function update<K extends keyof RequisitionFormState>(key: K, value: RequisitionFormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }));
		setErrors(prev => {
			if (!prev[key as string]) return prev;
			const next = { ...prev } as Record<string, string>;
			delete next[key as string];
			return next;
		});
	}

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
        await requisitionSchema.validate(form, { abortEarly: false });
        setStatus(null);
        setErrors({});
        setConfirmOpen(true);
    } catch (err) {
        const validationErrors: Record<string, string> = {};
        if (err && typeof err === 'object' && 'inner' in (err as any)) {
            for (const issue of (err as any).inner as Array<{ path?: string; message: string }>) {
                if (issue.path && !validationErrors[issue.path]) validationErrors[issue.path] = issue.message;
            }
        }
        setErrors(validationErrors);
        setStatus({ type: 'error', text: 'Please fix the highlighted fields and try again.' });
    }
}

const [jobLevelOptions, setJobLevelOptions] = useState<JobLevelOption[]>([]);
const [jobTypes, setJobTypes] = useState<string[]>([]);
const [priorities, setPriorities] = useState<string[]>([]);
const [positionTypes, setPositionTypes] = useState<string[]>([]);

useEffect(() => {
    let canceled = false;
    fetchJobLevels().then(levels => { if (!canceled) setJobLevelOptions(levels); });
    fetchRequisitionEnums().then(enums => {
        if (canceled) return;
        setJobTypes(enums.jobTypes);
        setPriorities(enums.priorities);
        setPositionTypes(enums.positionTypes);
    });
    return () => { canceled = true; };
}, []);

const [aiBusy, setAiBusy] = useState<'jd' | 'justification' | null>(null);
const [aiModalOpen, setAiModalOpen] = useState(false);
const [aiModalText, setAiModalText] = useState('');
const [aiModalTarget, setAiModalTarget] = useState<'jd' | 'justification' | null>(null);
const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
const [confirmOpen, setConfirmOpen] = useState(false);
const [draftSavedOpen, setDraftSavedOpen] = useState(false);

	async function enhanceJobDescription(): Promise<void> {
		try {  
			setAiBusy('jd');
            const improved = await enhanceTextWithAI(form.description || 'Draft job description', {
				roleContext: `${form.jobTitle || 'Role'}`
			});
            setAiModalTarget('jd');
            setAiModalText(improved);
            setAiModalOpen(true);
		} catch (err) {
			setStatus({ type: 'error', text: (err as Error).message });
		} finally {
			setAiBusy(null);
		}
	}

	async function enhanceJustification(): Promise<void> {
		try {
			setAiBusy('justification');
            const improved = await enhanceTextWithAI(form.hiringJustification || 'Draft hiring justification', {
				roleContext: `${form.jobTitle || 'Role'} justification`
			});
            setAiModalTarget('justification');
            setAiModalText(improved);
            setAiModalOpen(true);
		} catch (err) {
			setStatus({ type: 'error', text: (err as Error).message });
		} finally {
			setAiBusy(null);
		}
	}

	async function confirmSubmit(): Promise<void> {
		setConfirmOpen(false);
		navigate('/requisitions/success');
	}

    return (
        <section className="max-w-[1100px] mx-auto">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="m-0">Job Requisition Request Form</h2>
                    <p className="text-gray-500 mt-1">Fill in the details below to raise a new job requisition. Fields marked * are mandatory.</p>
                </div>
            </div>

            {status ? (
                <div className={status.type === 'success' ? 'mt-4 p-3 rounded-lg border border-green-200 bg-green-50 text-green-800' : status.type === 'error' ? 'mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-800' : 'mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-800'} role="status">
                    <div className="flex items-start justify-between gap-3">
                        <span>{status.text}</span>
                        <button type="button" className="px-2 py-1 rounded-md border border-transparent bg-transparent text-current cursor-pointer" onClick={() => setStatus(null)} aria-label="Dismiss notification">✕</button>
                    </div>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-[2fr_1fr] gap-4">
                    {/* Left column */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
					<div>
						<label className="block text-xs text-gray-700 font-semibold">Job Title *</label>
						<input
							type="text"
							value={form.jobTitle}
							onChange={e => update('jobTitle', e.target.value)}
							placeholder="e.g., Senior Software Engineer"
							className={`w-full mt-1.5 px-3 py-2.5 rounded-lg border outline-none bg-white box-border ${errors.jobTitle ? 'border-red-500' : 'border-gray-200'}`}
						/>
						{errors.jobTitle ? <div className="mt-1 text-xs text-red-600">{errors.jobTitle}</div> : null}
					</div>

                    <div>
                        <label className="block text-xs text-gray-700 font-semibold">Reporting Manager</label>
                        <input
							className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
							value={form.hiringManager}
							onChange={e => update('hiringManager', e.target.value)}
							placeholder="Manager name"
						/>
                    </div>

                    <div>
						<label className="block text-xs text-gray-700 font-semibold">Job Level / Grade *</label>
						<select
							className={`w-full mt-1.5 px-3 py-2.5 rounded-lg border outline-none bg-white box-border ${errors.jobLevel ? 'border-red-500' : 'border-gray-200'}`}
							value={form.jobLevel}
							onChange={e => {
								const selected = jobLevelOptions.find(o => o.value === e.target.value);
								update('jobLevel', e.target.value);
								if (selected) update('experienceRange', selected.range);
							}}
						>
							<option value="">Select grade</option>
							{jobLevelOptions.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label} ({opt.range})
								</option>
							))}
						</select>
                        {errors.jobLevel ? <div className="mt-1 text-xs text-red-600">{errors.jobLevel}</div> : null}
                    </div>

                    <div>
                        <label className="block text-xs text-gray-700 font-semibold">Job Type *</label>
                        <select
							className={`w-full mt-1.5 px-3 py-2.5 rounded-lg border outline-none bg-white box-border ${errors.jobType ? 'border-red-500' : 'border-gray-200'}`}
							value={form.jobType}
							onChange={e => update('jobType', e.target.value)}
						>
                            <option value="">Select type</option>
                            {jobTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.jobType ? <div className="mt-1 text-xs text-red-600">{errors.jobType}</div> : null}
                    </div>



					<div>
                        <label className="block text-xs text-gray-700 font-semibold">Location *</label>
						<input
							type="text"
							value={form.location}
							onChange={e => update('location', e.target.value)}
							placeholder="e.g., Pune / Remote"
							className={`w-full mt-1.5 px-3 py-2.5 rounded-lg border outline-none bg-white box-border ${errors.location ? 'border-red-500' : 'border-gray-200'}`}
						/>
                        {errors.location ? <div className="mt-1 text-xs text-red-600">{errors.location}</div> : null}
					</div>

                    <div>
                        <label className="block text-xs text-gray-700 font-semibold">Target Start Date</label>
                        <input
							className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
							type="date"
							value={form.startDate ?? ''}
							onChange={e => update('startDate', e.target.value)}
						/>
                    </div>

					<div>
						<label className="block text-xs text-gray-700 font-semibold">Priority *</label>
                        <select
							className={`w-full mt-1.5 px-3 py-2.5 rounded-lg border outline-none bg-white box-border ${errors.priority ? 'border-red-500' : 'border-gray-200'}`}
							value={form.priority ?? ''}
							onChange={e => update('priority', e.target.value)}
						>
                            {priorities.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        {errors.priority ? <div className="mt-1 text-xs text-red-600">{errors.priority}</div> : null}
					</div>

					<div>
						<label className="block text-xs text-gray-700 font-semibold">Budget (₹)</label>
						<input
							type="number"
							min={0}
							value={form.budget}
							onChange={e => update('budget', e.target.value === '' ? '' : Number(e.target.value))}
							placeholder="e.g., 1200000"
							className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
						/>
					</div>

					<div className="col-span-full">
                        <label className="block text-xs text-gray-700 font-semibold">Job Description *</label>
						<div className="relative">
							<textarea
								className={`w-full mt-1.5 px-3 py-2.5 pr-24 rounded-lg border outline-none bg-white box-border resize-y ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
								rows={5}
								value={form.description}
								onChange={e => update('description', e.target.value)}
								placeholder="Describe responsibilities"
							/>
                            <button
                                type="button"
                                className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full border border-gray-200 bg-white text-gray-800 font-bold cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={enhanceJobDescription}
                                disabled={aiBusy !== null}
                                aria-label="Enhance job description with AI"
                                title={aiBusy === 'jd' ? 'Enhancing…' : 'Enhance with AI'}
                            >
                                <span aria-hidden>✨</span>
                            </button>
						</div>
                        {errors.description ? <div className="mt-1 text-xs text-red-600">{errors.description}</div> : null}
					</div>
				</div>
                        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                            <div>
                                <label className="block text-xs text-gray-700 font-semibold">Required Skills (comma-separated)</label>
                                <input
								className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
								value={form.requiredSkills}
								onChange={e => update('requiredSkills', e.target.value)}
							/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-700 font-semibold">Preferred Skills (optional)</label>
                                <input
								className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
								value={form.preferredSkills}
								onChange={e => update('preferredSkills', e.target.value)}
							/>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                            <div>
                                <label className="block text-xs text-gray-700 font-semibold">Experience Range</label>
                                <input
								className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
								value={form.experienceRange}
								onChange={e => update('experienceRange', e.target.value)}
								placeholder="e.g., 3–5 years"
							/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-700 font-semibold">Education Qualification</label>
                                <input
								className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
								value={form.educationQualification}
								onChange={e => update('educationQualification', e.target.value)}
							/>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-xs text-gray-700 font-semibold">Proposed Salary Range</label>
                            <input
								className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
								value={form.salaryRange}
								onChange={e => update('salaryRange', e.target.value)}
								placeholder="e.g., 8L–12LPA"
							/>
                        </div>

					<div className="mt-3">
                            <label className="block text-xs text-gray-700 font-semibold">Hiring Justification *</label>
						<div className="relative">
							<textarea
									className={`w-full mt-1.5 px-3 py-2.5 pr-24 rounded-lg border outline-none bg-white box-border resize-y ${errors.hiringJustification ? 'border-red-500' : 'border-gray-200'}`}
								rows={4}
								value={form.hiringJustification}
								onChange={e => update('hiringJustification', e.target.value)}
								placeholder="Explain the need for this hire"
							/>
                            <button
                                type="button"
                                className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full border border-gray-200 bg-white text-gray-800 font-bold cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={enhanceJustification}
                                disabled={aiBusy !== null}
                                aria-label="Enhance hiring justification with AI"
                                title={aiBusy === 'justification' ? 'Enhancing…' : 'Enhance with AI'}
                            >
                                <span aria-hidden>✨</span>
                            </button>
						</div>
                            {errors.hiringJustification ? <div className="mt-1 text-xs text-red-600">{errors.hiringJustification}</div> : null}
					</div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4">
                        {/* Requisition Meta removed as requested */}

                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <h3 className="mt-0 mb-3 text-base font-semibold">Replacement / Approvals</h3>
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">Replacement or New Position</label>
                                    <select
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.isReplacement}
									onChange={e => update('isReplacement', e.target.value)}
								>
									{positionTypes.map(pt => (
										<option key={pt} value={pt}>{pt}</option>
									))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">If Replacement – Previous Employee Name</label>
                                    <input
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.previousEmployeeName}
									onChange={e => update('previousEmployeeName', e.target.value)}
								/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">Expected Duration (if Contract)</label>
                                    <input
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.expectedDuration}
									onChange={e => update('expectedDuration', e.target.value)}
								/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">Approver 1 – Reporting Manager</label>
                                    <input
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.approver1}
									onChange={e => update('approver1', e.target.value)}
								/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">Approver 2 – HR Lead</label>
                                    <input
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.approver2}
									onChange={e => update('approver2', e.target.value)}
								/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-700 font-semibold">Approver 3 – Finance (if needed)</label>
                                    <input
									className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border"
									value={form.approver3}
									onChange={e => update('approver3', e.target.value)}
								/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <h3 className="mt-0 mb-3 text-base font-semibold">Attachments</h3>
                            <input type="file" />
                            <p className="text-gray-500 text-xs mt-2">Supported formats: PDF, DOCX. Max size: 5MB.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex gap-3 flex-wrap justify-end">
                            <button type="button" className="px-3.5 py-2.5 rounded-lg border border-transparent bg-transparent text-gray-500 font-semibold cursor-pointer" onClick={() => window.history.back()}>Cancel</button>
                    <button
                        type="button"
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 font-semibold cursor-pointer"
                        onClick={() => {
                            try {
                                const draftsRaw = localStorage.getItem('requisitionDrafts');
                                const drafts = draftsRaw ? JSON.parse(draftsRaw) as any[] : [];
                                const newDraft = {
                                    id: `${Date.now()}`,
                                    savedAt: new Date().toISOString(),
                                    form
                                };
                                drafts.unshift(newDraft);
                                localStorage.setItem('requisitionDrafts', JSON.stringify(drafts));
                                setDraftSavedOpen(true);
                            } catch (err) {
                                setStatus({ type: 'error', text: 'Failed to save draft. Please try again.' });
                            }
                        }}
                    >
                        Save as Draft
                    </button>
                    <button type="submit" className="px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer">Submit Request</button>
                </div>
            </form>

            {aiModalOpen ? (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-[100]" role="dialog" aria-modal>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 w-[min(720px,92vw)] shadow-xl">
                        <h3 className="mt-0">AI Suggestion</h3>
                        <div className="mt-2">
                            <textarea
                                className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 outline-none bg-white box-border min-h-[180px] resize-y"
                                value={aiModalText}
                                onChange={e => setAiModalText(e.target.value)}
                            />
                        </div>
                        <div className="mt-3.5 flex gap-2 justify-end flex-wrap">
                            <button
								type="button"
								className="px-3.5 py-2.5 rounded-lg border border-transparent bg-transparent text-gray-500 font-semibold cursor-pointer"
								onClick={() => { setAiModalOpen(false); setAiModalText(''); setAiModalTarget(null); }}
							>
								Cancel
							</button>
                            <button
								type="button"
								className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 font-semibold cursor-pointer"
								onClick={() => { setAiModalOpen(false); setAiModalText(''); setAiModalTarget(null); }}
							>
								Keep Your Response
							</button>
                            <button
                                type="button"
                                className="px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer"
                                onClick={() => {
                                    if (aiModalTarget === 'jd') update('description', aiModalText);
                                    if (aiModalTarget === 'justification') update('hiringJustification', aiModalText);
                                    setAiModalOpen(false);
                                    setAiModalText('');
                                    setAiModalTarget(null);
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {confirmOpen ? (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-[110]" role="dialog" aria-modal>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 w-[min(820px,94vw)] shadow-xl max-h-[86vh] overflow-auto">
                        <h3 className="mt-0">Confirm Job Requisition</h3>
                        <p className="text-gray-600 text-sm mt-1">Please review the details below before submitting.</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Job Title</div>
                                <div className="font-semibold">{form.jobTitle || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
						<div className="text-gray-500">Location</div>
						<div className="font-semibold">{form.location || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Reporting Manager</div>
                                <div className="font-semibold">{form.hiringManager || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Location</div>
                                <div className="font-semibold">{form.location || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Job Level</div>
                                <div className="font-semibold">{form.jobLevel || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Job Type</div>
                                <div className="font-semibold">{form.jobType || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Priority</div>
                                <div className="font-semibold">{form.priority || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-gray-500">Budget (₹)</div>
                                <div className="font-semibold">{form.budget || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:col-span-2">
                                <div className="text-gray-500">Job Description</div>
                                <div className="font-semibold whitespace-pre-wrap">{form.description || '—'}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:col-span-2">
                                <div className="text-gray-500">Hiring Justification</div>
                                <div className="font-semibold whitespace-pre-wrap">{form.hiringJustification || '—'}</div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 justify-end flex-wrap">
                            <button type="button" className="px-3.5 py-2.5 rounded-lg border border-transparent bg-transparent text-gray-600 font-semibold cursor-pointer" onClick={() => setConfirmOpen(false)}>Back</button>
                            <button type="button" className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 font-semibold cursor-pointer" onClick={() => setConfirmOpen(false)}>Edit Details</button>
                            <button
                                type="button"
                                className="px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer"
                                onClick={() => {
                                    const createdBy = localStorage.getItem('role') === 'HR' ? 'HR User' : 'Hiring Manager';
                                    const rec = createRequisition({
										jobTitle: form.jobTitle,
                                        location: form.location,
                                        hiringManager: form.hiringManager,
                                        jobLevel: form.jobLevel,
                                        jobType: form.jobType,
                                        priority: form.priority,
                                        budget: form.budget,
                                        description: form.description,
                                        hiringJustification: form.hiringJustification
                                    }, createdBy);
                                    setConfirmOpen(false);
                                    navigate('/requisitions/success', { state: { number: rec.number } });
                                }}
                            >
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {draftSavedOpen ? (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-[110]" role="dialog" aria-modal>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 w-[min(520px,92vw)] shadow-xl text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-blue-700 grid place-items-center text-xl">💾</div>
                        <h3 className="mt-3 mb-1">Draft Saved</h3>
                        <p className="text-gray-600 text-sm m-0">Your requisition draft has been saved locally.</p>
                        <div className="mt-4 flex gap-2 justify-center flex-wrap">
                            <button type="button" className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 font-semibold cursor-pointer" onClick={() => setDraftSavedOpen(false)}>Continue Editing</button>
                            <button type="button" className="px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer" onClick={() => { setDraftSavedOpen(false); navigate('/dashboard'); }}>Go to Dashboard</button>
                        </div>
                    </div>
                </div>
            ) : null}
		</section>
	);
}


// All styles converted to Tailwind classes


