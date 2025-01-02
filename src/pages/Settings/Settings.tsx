import React, { useState } from 'react';
import styled from 'styled-components';
import { useTVNavigation } from '@/hooks/useTVNavigation';
import TizenDialog from '@/components/Dialog/TizenDialog';
import TizenKeyboard from '@/components/Keyboard/TizenKeyboard';
import { ISettings } from '@/types';

interface SettingsProps {
  onSave: (settings: any) => void;
  onBack: () => void;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Setting = styled.div<{ selected?: boolean }>`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const SettingTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SettingValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HelpText = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface DialogConfig {
  title: string;
  type: 'text' | 'number' | 'select' | 'toggle' | 'keyboard';
  value: any;
  options?: { label: string; value: any }[];
  section: string;
  setting: string;
  placeholder?: string;
  keyboardType?: 'text' | 'password' | 'number';
}

const Settings: React.FC<SettingsProps> = ({ onSave, onBack }) => {
  const [settings, setSettings] = useState<ISettings>({
    server: {
      url: '',
      username: '',
      password: '',
    },
    player: {
      autoplay: true,
      volume: 100,
      quality: 'auto',
    },
    epg: {
      enabled: true,
      source: 'default',
    },
  });

  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  const { registerElement } = useTVNavigation({
    grid: true,
    gridColumns: 2,
    onSelect: (element) => {
      const section = element.getAttribute('data-section');
      const setting = element.getAttribute('data-setting');

      if (section && setting) {
        const value = settings[section][setting];
        let dialogConfig: DialogConfig;

        switch (`${section}.${setting}`) {
          case 'server.url':
            dialogConfig = {
              title: `Enter ${setting}`,
              type: 'keyboard',
              value,
              section,
              setting,
              placeholder: 'http://example.com',
              keyboardType: 'text',
            };
            break;
          case 'server.username':
            dialogConfig = {
              title: `Enter ${setting}`,
              type: 'keyboard',
              value,
              section,
              setting,
              placeholder: 'Username',
              keyboardType: 'text',
            };
            break;
          case 'server.password':
            dialogConfig = {
              title: `Enter ${setting}`,
              type: 'keyboard',
              value,
              section,
              setting,
              placeholder: 'Password',
              keyboardType: 'password',
            };
            break;
          case 'player.autoplay':
          case 'epg.enabled':
            dialogConfig = {
              title: `Toggle ${setting}`,
              type: 'toggle',
              value,
              section,
              setting,
            };
            break;
          case 'player.volume':
            dialogConfig = {
              title: `Set ${setting}`,
              type: 'number',
              value,
              section,
              setting,
            };
            break;
          case 'player.quality':
            dialogConfig = {
              title: `Select ${setting}`,
              type: 'select',
              value,
              options: [
                { label: 'Auto', value: 'auto' },
                { label: '1080p', value: '1080p' },
                { label: '720p', value: '720p' },
                { label: '480p', value: '480p' },
              ],
              section,
              setting,
            };
            break;
          case 'epg.source':
            dialogConfig = {
              title: `Select ${setting}`,
              type: 'select',
              value,
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Custom', value: 'custom' },
              ],
              section,
              setting,
            };
            break;
          default:
            return;
        }

        setDialog(dialogConfig);
      }
    },
  });

  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value,
      },
    }));
    setDialog(null);
    onSave(settings);
  };

  return (
    <Container>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Server</SectionTitle>
        <Grid>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 0)}
            data-section="server"
            data-setting="url"
          >
            <SettingTitle>URL</SettingTitle>
            <SettingValue>{settings.server.url || 'Not set'}</SettingValue>
          </Setting>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 1)}
            data-section="server"
            data-setting="username"
          >
            <SettingTitle>Username</SettingTitle>
            <SettingValue>{settings.server.username || 'Not set'}</SettingValue>
          </Setting>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 2)}
            data-section="server"
            data-setting="password"
          >
            <SettingTitle>Password</SettingTitle>
            <SettingValue>{'•'.repeat(settings.server.password.length)}</SettingValue>
          </Setting>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Player</SectionTitle>
        <Grid>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 3)}
            data-section="player"
            data-setting="autoplay"
          >
            <SettingTitle>Autoplay</SettingTitle>
            <SettingValue>{settings.player.autoplay ? 'On' : 'Off'}</SettingValue>
          </Setting>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 4)}
            data-section="player"
            data-setting="volume"
          >
            <SettingTitle>Volume</SettingTitle>
            <SettingValue>{settings.player.volume}%</SettingValue>
          </Setting>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 5)}
            data-section="player"
            data-setting="quality"
          >
            <SettingTitle>Quality</SettingTitle>
            <SettingValue>{settings.player.quality}</SettingValue>
          </Setting>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>EPG</SectionTitle>
        <Grid>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 6)}
            data-section="epg"
            data-setting="enabled"
          >
            <SettingTitle>Enabled</SettingTitle>
            <SettingValue>{settings.epg.enabled ? 'On' : 'Off'}</SettingValue>
          </Setting>
          <Setting
            className="focusable"
            ref={(el) => registerElement(el, 7)}
            data-section="epg"
            data-setting="source"
          >
            <SettingTitle>Source</SettingTitle>
            <SettingValue>{settings.epg.source}</SettingValue>
          </Setting>
        </Grid>
      </Section>

      <HelpText>
        Use UP/DOWN to navigate, ENTER to edit, RETURN to go back
      </HelpText>

      {dialog && (
        dialog.type === 'keyboard' ? (
          <TizenKeyboard
            initialValue={dialog.value}
            placeholder={dialog.placeholder}
            type={dialog.keyboardType}
            onSubmit={(value) =>
              handleSettingChange(dialog.section, dialog.setting, value)
            }
            onCancel={() => setDialog(null)}
          />
        ) : (
          <TizenDialog
            title={dialog.title}
            type={dialog.type}
            value={dialog.value}
            options={dialog.options}
            onConfirm={(value) =>
              handleSettingChange(dialog.section, dialog.setting, value)
            }
            onCancel={() => setDialog(null)}
          />
        )
      )}
    </Container>
  );
};

export default Settings;
