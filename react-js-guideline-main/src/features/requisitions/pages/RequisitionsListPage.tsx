import { useEffect, useState } from 'react';
import { listRequisitions, updateRequisitionStatus } from '../../../services/requisitionStore';

export default function RequisitionsListPage(): JSX.Element {
  const [records, setRecords] = useState(listRequisitions());
  const role = typeof localStorage !== 'undefined' ? localStorage.getItem('role') || 'User' : 'User';

  useEffect(() => {
    setRecords(listRequisitions());
  }, []);

  return (
    <section className="p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-xl font-semibold">Requisitions</h2>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Req #</th>
                <th className="py-2 px-2">Title</th>
                <th className="py-2 px-2">Location</th>
                <th className="py-2 px-2">Created By</th>
                <th className="py-2 px-2">Status</th>
                {role === 'HR' ? <th className="py-2 px-2">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={role === 'HR' ? 6 : 5} className="py-6 text-center text-gray-500">No requisitions yet.</td>
                </tr>
              ) : records.map(r => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="py-2 px-2 whitespace-nowrap font-medium">{r.number}</td>
                  <td className="py-2 px-2">{r.jobTitle}</td>
                  <td className="py-2 px-2">{r.location}</td>
                  <td className="py-2 px-2">{r.createdBy}</td>
                  <td className="py-2 px-2">
                    <span className={
                      r.status === 'Approved' ? 'inline-block px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200' :
                      r.status === 'Rejected' ? 'inline-block px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 border border-red-200' :
                      'inline-block px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200'
                    }>
                      {r.status}
                    </span>
                  </td>
                  {role === 'HR' ? (
                    <td className="py-2 px-2">
                      {r.status === 'Pending HR Approval' ? (
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white cursor-pointer" onClick={() => { updateRequisitionStatus(r.id, 'Rejected'); setRecords(listRequisitions()); }}>Reject</button>
                          <button className="px-3 py-1.5 rounded-lg border border-green-600 bg-green-600 text-white font-bold cursor-pointer" onClick={() => { updateRequisitionStatus(r.id, 'Approved'); setRecords(listRequisitions()); }}>Approve</button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}




