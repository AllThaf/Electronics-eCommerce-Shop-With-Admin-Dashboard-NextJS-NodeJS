import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";

interface BreadcrumbItem {
  label: string;
  link: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="text-lg breadcrumbs pb-10 py-5 max-sm:text-base">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              {index === 0 && <FaHouse className="mr-2" />}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
