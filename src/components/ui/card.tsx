import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: React.ReactNode;
    noPadding?: boolean;
    actions?: React.ReactNode;
}

export function Card({ title, children, className, noPadding = false, actions, ...props }: CardProps) {
    return (
        <div
            className={twMerge(
                "glass-card rounded-lg overflow-hidden flex flex-col relative",
                "before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-f1-red before:to-transparent",
                "shadow-lg transition-all duration-300",
                className
            )}
            {...props}
        >
            {title && (
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider font-mono">
                        {title}
                    </h3>
                    {actions}
                </div>
            )}
            <div className={clsx("flex-1 h-full", !noPadding && "p-4")}>
                {children}
            </div>
        </div>
    );
}
