import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Universal Vector Icon Wrapper (Phosphor / Lucide matching Section 5)
 * ZERO emoji anywhere. Real scalable vector icons with customizable weight and tone.
 */
export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style,
  ...props
}) {
  const iconMap = {
    // Nav & Modules
    dashboard: LucideIcons.LayoutGrid,
    directory: LucideIcons.Users,
    attendance: LucideIcons.Fingerprint,
    leave: LucideIcons.Plane,
    shifts: LucideIcons.CalendarDays,
    payroll: LucideIcons.Wallet,
    tasks: LucideIcons.CheckSquare,
    performance: LucideIcons.Target,
    announcements: LucideIcons.Megaphone,
    documents: LucideIcons.FileText,
    helpdesk: LucideIcons.Headphones,
    reports: LucideIcons.TrendingUp,
    settings: LucideIcons.Settings,

    // Actions & Status
    bell: LucideIcons.Bell,
    search: LucideIcons.Search,
    plus: LucideIcons.Plus,
    filter: LucideIcons.Filter,
    check: LucideIcons.Check,
    checkCircle: LucideIcons.CheckCircle,
    xCircle: LucideIcons.XCircle,
    x: LucideIcons.X,
    menu: LucideIcons.Menu,
    more: LucideIcons.MoreHorizontal,
    chevronRight: LucideIcons.ChevronRight,
    chevronDown: LucideIcons.ChevronDown,
    chevronLeft: LucideIcons.ChevronLeft,
    arrowRight: LucideIcons.ArrowRight,
    arrowLeft: LucideIcons.ArrowLeft,
    arrowUp: LucideIcons.ArrowUp,
    arrowDown: LucideIcons.ArrowDown,
    moon: LucideIcons.Moon,
    sun: LucideIcons.Sun,
    logout: LucideIcons.LogOut,
    shieldCheck: LucideIcons.ShieldCheck,
    lock: LucideIcons.Lock,
    fingerprint: LucideIcons.Fingerprint,
    clock: LucideIcons.Clock,
    calendar: LucideIcons.Calendar,
    download: LucideIcons.Download,
    eye: LucideIcons.Eye,
    eyeOff: LucideIcons.EyeOff,
    refresh: LucideIcons.RefreshCw,
    mapPin: LucideIcons.MapPin,
    phone: LucideIcons.Phone,
    mail: LucideIcons.Mail,
    alertTriangle: LucideIcons.AlertTriangle,
    activity: LucideIcons.Activity,
    sparkles: LucideIcons.Sparkles,
    zap: LucideIcons.Zap,
    user: LucideIcons.User,
    userCircle: LucideIcons.UserCircle,
    externalLink: LucideIcons.ExternalLink
  };

  const Component = iconMap[name] || LucideIcons[name] || LucideIcons.HelpCircle;

  return (
    <Component
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      {...props}
    />
  );
}

export default Icon;
