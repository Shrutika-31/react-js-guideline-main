import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../../../services/requisitions';
import type { DashboardData } from '../../../types/dashboard';
import PanelCard from '../components/PanelCard';
import StatTile from '../components/StatTile';
import { listRequisitions, updateRequisitionStatus } from '../../../services/requisitionStore';

export default function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [records, setRecords] = useState(listRequisitions());
  const role = typeof localStorage !== 'undefined' ? localStorage.getItem('role') || 'User' : 'User';

  useEffect(() => {
    let canceled = false;
    fetchDashboardData().then(d => { if (!canceled) setData(d); });
    // refresh from local storage on mount
    setRecords(listRequisitions());
    return () => { canceled = true; };
  }, []);

  const recentReqs = useMemo(() => {
    const mapped = records.slice(0, 5).map(r => ({
      title: `${r.jobTitle} (${r.number})`,
      status: r.status,
      openDate: r.openDate
    }));
    return mapped.length ? mapped : (data?.recentRequisitions ?? []);
  }, [records, data]);
  return (
    <section className="p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-xl font-semibold">Dashboard</h2>
        <small className="text-gray-500">{data?.subtitle ?? ''}</small>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile title="Open Roles" value={data?.kpis.openRoles.value ?? 0} subtitle={data?.kpis.openRoles.delta ?? ''} onClick={() => navigate('/requisitions/new')} />
        <StatTile title="Avg Time to Hire (days)" value={data?.kpis.avgTimeToHireDays.value ?? 0} subtitle={data?.kpis.avgTimeToHireDays.delta ?? ''} />
        <StatTile title="Pipeline (Active)" value={data?.kpis.pipelineActive.value ?? 0} subtitle={data?.kpis.pipelineActive.delta ?? ''} />
        <StatTile title="Offer Acceptance" value={data?.kpis.offerAcceptance.value ?? ''} subtitle={data?.kpis.offerAcceptance.delta ?? ''} />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
        <PanelCard title="Recent Requisitions" action={<button className="text-brand font-bold" onClick={() => navigate('/requisitions/new')}>New</button>}>
          <div className="grid grid-cols-[1.6fr_.8fr_.8fr] gap-2 text-xs text-gray-500 mb-2">
            <span>Title</span>
            <span>Status</span>
            <span>Open Date</span>
          </div>
          {recentReqs.map((r, idx) => (
            <div key={idx} className="grid grid-cols-[1.6fr_.8fr_.8fr] gap-2 py-2 px-2 border-t border-gray-100">
              <span className="font-semibold">{r.title}</span>
              <span>{r.status}</span>
              <span>{r.openDate}</span>
            </div>
          ))}
        </PanelCard>
        </div>

        <div className="flex flex-col gap-4">
          <PanelCard title="Recent Activity">
            {(data?.recentActivity ?? []).map((t, idx) => (
              <div key={idx} className={idx === 0 ? 'py-2 text-sm' : 'py-2 text-sm border-t border-gray-100'}>
                {t}
              </div>
            ))}
          </PanelCard>
          {role === 'HR' ? (
            <PanelCard title="Pending Approvals">
              {records.filter(r => r.status === 'Pending HR Approval').length === 0 ? (
                <div className="py-3 text-sm text-gray-500">No pending approvals.</div>
              ) : (
                records.filter(r => r.status === 'Pending HR Approval').map(r => (
                  <div key={r.id} className="py-2 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{r.jobTitle} <span className="text-gray-500">({r.number})</span></div>
                      <div className="text-xs text-gray-500">{r.location}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white cursor-pointer" onClick={() => { updateRequisitionStatus(r.id, 'Rejected'); setRecords(listRequisitions()); }}>Reject</button>
                      <button className="px-3 py-1.5 rounded-lg border border-green-600 bg-green-600 text-white font-bold cursor-pointer" onClick={() => { updateRequisitionStatus(r.id, 'Approved'); setRecords(listRequisitions()); }}>Approve</button>
                    </div>
                  </div>
                ))
              )}
            </PanelCard>
          ) : null}
        </div>
      </div>
      </div>
    </section>
  );
}

