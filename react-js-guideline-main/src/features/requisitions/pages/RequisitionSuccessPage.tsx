import { useLocation, useNavigate } from 'react-router-dom';

export default function RequisitionSuccessPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { number?: string } };
  const reqNumber = location.state?.number;
  return (
    <section className="h-[calc(100vh-120px)] grid place-items-center">
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-[min(520px,92vw)] text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-700 grid place-items-center text-xl">✔</div>
        <h2 className="mt-3 mb-1">Job Requisition Created</h2>
        <p className="text-gray-600 m-0">Your job requisition has been created successfully.</p>
        {reqNumber ? (
          <p className="text-gray-900 font-semibold mt-2">Requisition #: {reqNumber}</p>
        ) : null}
        <div className="mt-5">
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            OK
          </button>
        </div>
      </div>
    </section>
  );
}


