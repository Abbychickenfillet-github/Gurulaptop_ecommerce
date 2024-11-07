import React from 'react'
import { Nav, Tab } from 'react-bootstrap'
import LeftAside from '@/components/dashboard/leftAside'
import CardExample from '@/components/bootstrap/cards'
import Coupon from '@/components/coupon'
import UserProfile from '@/components/dashboard/userInfoEdit'
import Paginationcomponent from '@/components/paginationcomponent/paginationcomponent'
import CouponQuery from '@/components/coupon/coupon-query-components'

export default function CouponPage() {
  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <LeftAside />
        <div className="col-md-9">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="coupon-record"
          >
            <Nav
              variant="tabs"
              className="mb-3"
              fill
              style={{ '--bs-nav-link-color': '#805AF5' }}
            >
              <Nav.Item>
                <Nav.Link eventKey="home">會員中心</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="shopping">購買清單</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="lease-record">租賃清單</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="coupon-record">優惠券</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="blog-record">文章</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activity-record">活動</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="group-record">揪團</Nav.Link>
              </Nav.Item>
            </Nav>

            {/* 會員中心 */}
            <Tab.Content>
              <Tab.Pane eventKey="home">
                <div>
                  <UserProfile />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="shopping">
                <div>
                  <h4>購買清單</h4>
                  <CardExample />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="lease-record">
                <div>
                  <h4>租賃清單</h4>
                  {/* 添加租賃清單內容 */}
                </div>
              </Tab.Pane>
              {/* 優惠卷 */}
              <Tab.Pane eventKey="coupon-record">
                <div className="container">
                  <CouponQuery />
                  <div className="row g-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="col-md-6">
                        <Coupon />
                      </div>
                    ))}
                  </div>
                  {/* 分頁 */}
                  <div className="pagination-section mt-4">
                    <Paginationcomponent />
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="blog-record">
                <div>
                  <h4>文章列表</h4>
                  {/* 添加文章列表內容 */}
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="activity-record">
                <div>
                  <h4>活動列表</h4>
                  {/* 添加活動列表內容 */}
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="group-record">
                <div>
                  <h4>揪團列表</h4>
                  {/* 添加揪團列表內容 */}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  )
}
