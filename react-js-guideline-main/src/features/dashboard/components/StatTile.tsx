import React from 'react';

export interface StatTileProps {
	title: string;
	value: number | string;
	subtitle?: string;
	onClick?: () => void;
}

export default function StatTile(props: StatTileProps): JSX.Element {
	const { title, value, subtitle, onClick } = props;

	return (
		<button
			onClick={onClick}
			className={`w-full text-left p-4 rounded-xl border border-gray-200 bg-white shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : 'cursor-default'}`}
			aria-label={title}
		>
			<div className="flex items-center gap-3">
				<div
					aria-hidden
					className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs"
				>
					{title.substring(0, 2).toUpperCase()}
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs text-gray-500 font-semibold">{title}</span>
					<span className="text-3xl leading-tight font-extrabold">{value}</span>
					{subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
				</div>
			</div>
		</button>
	);
}


