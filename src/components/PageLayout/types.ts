import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type { TreeMenuItem } from '../Navigation-Island/tree-menu';
import type { OrbmobileLocale } from '../../i18n';

export interface CAppHeaderUser {
  name: string;
  subtitle?: string;
  avatarText?: string;
  avatarSrc?: string;
}

export interface CAppHeaderUserMenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface CAppHeaderProps {
  appTitle: string;
  logo?: ReactNode;
  mode?: 'light' | 'dark' | 'system';
  onToggleMode?: () => void;
  locale?: OrbmobileLocale;
  localeLabel?: string;
  localeOptions?: OrbmobileLocale[];
  onLocaleChange?: (locale: OrbmobileLocale) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  user?: CAppHeaderUser;
  onUserSetting?: () => void;
  onUserLogout?: () => void;
  userMenuItems?: CAppHeaderUserMenuItem[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export interface CAppPageLayoutProps {
  appTitle: string;
  menuData?: TreeMenuItem[];
  children: ReactNode;
  showNavigation?: boolean;
  locale?: OrbmobileLocale;
  localeLabel?: string;
  localeOptions?: OrbmobileLocale[];
  onLocaleChange?: (locale: OrbmobileLocale) => void;
  user?: CAppHeaderUser;
  onUserSetting?: () => void;
  onUserLogout?: () => void;
  userMenuItems?: CAppHeaderUserMenuItem[];
  logo?: ReactNode;
  onSearch?: (query: string) => void;
  rightHeaderSlot?: ReactNode;
  leftHeaderSlot?: ReactNode;
  contentSx?: SxProps<Theme>;
}
