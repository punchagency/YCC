import React from "react";
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { TabView, TabPanel } from 'primereact/tabview';

const AddUser = () => {
    const navigate = useNavigate();

    const goUserPage = () => {
        console.log('Navigating to /user-management/users'); // Add a log to check
        navigate('/user-management/users');
    };
    return (
        <main className="flex h-screen page">
           <LeftMenu />
           <div className="w-full right-panel-component">
                <AdminHeader />
                <div className="flex align-items-center justify-content-between sub-header-panel">
                    <div className="sub-header-left sub-header-left-with-arrow">
                    <div className='arrow'>
                        <Link to="/user-management/users"> {/* Replace "/previous-page" with your target route */}
                            <i className="pi pi-angle-left"></i>
                        </Link>
                    </div>    
                    <div className='content'>
                        <h3>Create a New User</h3>
                        <p>Enter the user detail and create an user</p>
                    </div>
                    </div>
                    <div className="sub-header-right">
                    <Button label="Cancel" icon="pi pi-times-circle" severity="secondary" outlined className="p-button-secondary mr-3"/>
                    <Button onClick={goUserPage} label="Save" icon="pi pi-save" className="p-button-primary" type="button" />
                    </div>
                </div>
                <div className="card-wrapper-gap">
                <TabView className="v-tab">
                    <TabPanel header="Header I">
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </TabPanel>
                    <TabPanel header="Header II">
                        <p className="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                            ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </TabPanel>
                    <TabPanel header="Header III">
                        <p className="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </TabPanel>
                </TabView>
                </div>
           </div>
        </main>
    );
};

export default AddUser;
