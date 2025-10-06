interface StatusBadgeProps {
  status: 'on-time' | 'delayed' | 'failed' | 'in-transit' | 'delivered' | 'idle' | 'active';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = {
    'on-time': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'delayed': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'failed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'in-transit': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'active': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'idle': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  const labels = {
    'on-time': 'On Time',
    'delayed': 'Delayed',
    'failed': 'Failed',
    'in-transit': 'In Transit',
    'delivered': 'Delivered',
    'idle': 'Idle',
    'active': 'Active',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${styles[status]} ${sizeClasses}`}>
      {labels[status]}
    </span>
  );
}
