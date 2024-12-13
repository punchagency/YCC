import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";

const UserDetails = () => {
  const navigate = useNavigate();
  // Access the userId from the URL
  useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const editUser = () => {
    navigate ("/user-management/users/edit")
  }
  const assignTask = () => {
    navigate ("/coming-soon")
  }

  // You can now use the userId to fetch or display the specific user details
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/user-management/users">
              {" "}
              {/* Replace "/previous-page" with your target route */}
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Devon Lane</h3>
            <p>User’s all type of information</p>
          </div>
        </div>
        <div className="sub-header-right">
          <Button
            label="Edit"
            icon="pi pi-user-edit"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
            onClick={editUser}
          />
          <Button
            label="Assign task"
            icon="pi pi-clipboard"
            className="p-button-primary"
            onClick={assignTask}
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="tabview-detaols"
        >
          <TabPanel header="Information Overview">
            <div className="v-grid v-grid-two-column">
              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Personal Information</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Full Name</div>
                        <div className="details-content-text">Devon Lane</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Date of Birth
                        </div>
                        <div className="details-content-text">
                          3rd Dec, 1987
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Nationality</div>
                        <div className="details-content-text">American</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Email</div>
                        <div className="details-content-text">
                          devon@yachtcrewcenter.com
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Phone</div>
                        <div className="details-content-text">
                          (480) 555-0103
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Address</div>
                        <div className="details-content-text">
                          864 E Broad Street, Fort Queenton, Missouri - 41138,
                          United States of America
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Emergency Contact</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Name</div>
                        <div className="details-content-text">Sana Robert</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Relationship
                        </div>
                        <div className="details-content-text">Wife</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Contact Number
                        </div>
                        <div className="details-content-text">
                          (480) 555-0103
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Professional Information</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Job Role</div>
                        <div className="details-content-text">
                          Engineer/ Crew member
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Department</div>
                        <div className="details-content-text">Engineering</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Years of Experience
                        </div>
                        <div className="details-content-text">12</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Certifications
                        </div>
                        <div className="details-content-text">
                          devon@yachtcrewcenter.com
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Medical Information</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">
                          Medical Restrictions
                        </div>
                        <div className="details-content-text">
                          Peanuts, tree nuts, dairy, gluten, or eggs. Yacht
                          kitchens often need to accommodate dietary
                          restrictions for safety.
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Account Information</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Username</div>
                        <div className="details-content-text">Devon@345</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Password</div>
                        <div className="details-content-text">Welcome#123</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Account Type
                        </div>
                        <div className="details-content-text">Admin</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default UserDetails;
