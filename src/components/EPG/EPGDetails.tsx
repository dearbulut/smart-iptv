import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGDetailsProps {
  program: IEPGProgram;
  onClose: () => void;
}

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundDark}CC;
  backdrop-filter: blur(5px);
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
`;

const Time = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const Description = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
`;

const Info = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EPGDetails: React.FC<EPGDetailsProps> = ({ program, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Container>
      <Title>{program.title}</Title>
      <Time>
        {new Date(program.start).toLocaleString()} - {new Date(program.end).toLocaleString()}
      </Time>
      {program.description && <Description>{program.description}</Description>}
      <Info>
        {program.genre && <span>Genre: {program.genre}</span>}
        {program.cast && <span> • Cast: {program.cast}</span>}
        {program.director && <span> • Director: {program.director}</span>}
        {program.rating && <span> • Rating: {program.rating}</span>}
      </Info>
    </Container>
  );
};

export default EPGDetails;
