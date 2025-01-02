import React, { useState } from 'react';
import styled from 'styled-components';
import { useSettingsService } from '@/contexts/ServiceContext';
import { ISettings } from '@/types';

interface SettingsProps {
  onSave: (settings: ISettings) => void;
  onBack: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  margin: 0 0 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const settingsService = useSettingsService();
  const [settings, setSettings] = useState<ISettings>(settingsService.getSettings());

  const handleChange = (section: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <Container>
      <Title>Settings</Title>
      <form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Server</SectionTitle>
          <FormGroup>
            <Label>URL</Label>
            <Input
              type="url"
              value={settings.server?.url || ''}
              onChange={(e) => handleChange('server', 'url', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              value={settings.server?.username || ''}
              onChange={(e) => handleChange('server', 'username', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={settings.server?.password || ''}
              onChange={(e) => handleChange('server', 'password', e.target.value)}
              required
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Player</SectionTitle>
          <FormGroup>
            <Label>Autoplay</Label>
            <Select
              value={settings.autoplay ? 'true' : 'false'}
              onChange={(e) => handleChange('player', 'autoplay', e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Quality</Label>
            <Select
              value={settings.quality}
              onChange={(e) => handleChange('player', 'quality', e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>EPG</SectionTitle>
          <FormGroup>
            <Label>Enable EPG</Label>
            <Select
              value={settings.epg?.enabled ? 'true' : 'false'}
              onChange={(e) => handleChange('epg', 'enabled', e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Update Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              value={settings.epg?.updateInterval ? settings.epg.updateInterval / 60000 : 60}
              onChange={(e) =>
                handleChange('epg', 'updateInterval', parseInt(e.target.value) * 60000)
              }
            />
          </FormGroup>
        </Section>

        <Button type="submit">Save</Button>
      </form>
    </Container>
  );
};

export default Settings;
