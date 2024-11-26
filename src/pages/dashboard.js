import React from 'react';
import LeftMenu from '../components/menu';
import AdminHeader from '../components/header';
import SubHeaderPanel from '../components/sub-header';

const Dashboard = () => {
  return (
    <main className="flex h-screen page">
        <LeftMenu/>
        <div className='w-full right-panel-component'>
            <AdminHeader/>
            <SubHeaderPanel/>
            <div className='card-wrapper-gap'>
                sdsdfds
            </div>
        </div>
    </main>
  );
};

export default Dashboard;