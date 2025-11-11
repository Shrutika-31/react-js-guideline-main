import React from 'react';

interface PanelCardProps {
	title: string;
	action?: React.ReactNode;
	children: React.ReactNode;
}

export default function PanelCard(props: PanelCardProps): JSX.Element {
	const { title, action, children } = props;
	return (
		<section className="border border-gray-200 rounded-xl bg-white shadow-sm">
			<header className="flex items-center justify-between p-4 border-b border-gray-100">
				<h3 className="m-0 text-base font-semibold">{title}</h3>
				{action}
			</header>
			<div className="p-4">
				{children}
			</div>
		</section>
	);
}


