import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Collections', path: '/collections' },
  { name: 'Journal', path: '/journal' },
  { name: 'About', path: '/about-us' },
  { name: 'Contact', path: '/contact' },
];

export const DesktopNavigation = () => (
  <nav aria-label="Main navigation" className="hidden h-full flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
    {navItems.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `group relative flex h-full items-center text-[11px] font-medium uppercase tracking-[0.22em] transition-colors ${
            isActive ? 'text-[#B58A3A]' : 'text-[#29231D] hover:text-[#B58A3A]'
          }`
        }
      >
        {item.name}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#B58A3A] transition-transform duration-200 group-hover:scale-x-100" />
      </NavLink>
    ))}
  </nav>
);
