export { default as UserManagement } from './UserManagement'
export { default as SystemSettingsComponent } from './SystemSettings'
export { default as SecuritySettings } from './SecuritySettings'

// Re-export com nomes mais específicos para evitar conflitos
export { UserManagement as SettingsUserManagement } from './UserManagement'
export { SystemSettingsComponent as SettingsSystemConfig } from './SystemSettings'
export { SecuritySettings as SettingsSecurityConfig } from './SecuritySettings'