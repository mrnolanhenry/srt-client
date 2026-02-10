import type { ReactNode } from 'react';
import './StickyFooter.css';

interface StickyFooterProps {
  children: ReactNode;
}

const StickyFooter = ({ children }: StickyFooterProps) => {
  return (
    <footer className="sticky-footer">
      {children}
    </footer>
  );
}

export default StickyFooter;