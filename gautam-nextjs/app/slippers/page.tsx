import { Suspense } from 'react';
import CatalogPage from '@/components/CatalogPage';
export default function Page(){return <Suspense fallback={<main className="container panel-page"><div className="admin-loading"/></main>}><CatalogPage category="slippers"/></Suspense>;}
