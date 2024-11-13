import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Coupon from '.'
import Coupon2 from './index2'
import { useAuth } from '@/hooks/use-auth'

const MySwal = withReactContent(Swal)

export default function CouponList() {
  const [couponDataList, setCouponDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const { auth } = useAuth()
  const userId = auth?.userData?.user_id
  const [claimedCoupons, setClaimedCoupons] = useState(new Set())

  console.log('當前auth狀態:', auth)
  console.log('用戶ID:', userId)

  const getCouponData = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/coupon')
      const resData = await res.json()

      if (resData.data?.coupons) {
        setCouponDataList(resData.data.coupons)
        // 初始化 claimedCoupons 集合
        const claimedIds = resData.data.coupons
          .filter((coupon) => coupon.valid === 0)
          .map((coupon) => coupon.coupon_id)
        setClaimedCoupons(new Set(claimedIds))
      }
    } catch (err) {
      setError('獲取優惠券資料失敗')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimCoupon = async (couponId) => {
    if (!userId) {
      MySwal.fire({
        icon: 'warning',
        title: '請先登入',
        text: '需要登入才能領取優惠券',
      })
      window.location.href = 'http://localhost:3000/member/login'
      return
    }

    try {
      const addResponse = await fetch(
        `http://localhost:3005/api/coupon-user/add/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coupon_id: couponId,
            valid: 0, // 設置為已領取
          }),
        }
      )

      try {
        const response = await fetch(`/api/coupon/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coupon_id: couponId }),
        })

        const result = await response.json()

        if (response.ok) {
          console.log(result.message)
        } else {
          console.error(result.message)
        }
      } catch (error) {
        console.error('領取失敗:', error)
      }

      const addResult = await addResponse.json()

      if (addResult.status === 'success') {
        setClaimedCoupons((prev) => new Set([...prev, couponId]))

        MySwal.fire({
          icon: 'success',
          title: '領取成功！',
          text: '優惠券已加入您的帳戶',
        })
        getCouponData()
      } else {
        MySwal.fire({
          icon: 'error',
          title: '領取失敗',
          text: addResult.message || '請稍後再試',
        })
      }
    } catch (error) {
      console.error('領取失敗:', error)
      MySwal.fire({
        icon: 'error',
        title: '領取失敗',
        text: '系統錯誤，請稍後再試',
      })
    }
  }

  useEffect(() => {
    setMounted(true)
    getCouponData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // 可以加入其他搜尋邏輯
  }

  const filteredCoupons = couponDataList.filter((coupon) => {
    const searchContent = searchTerm.toLowerCase()
    return (
      coupon.coupon_content.toLowerCase().includes(searchContent) ||
      coupon.coupon_code.toLowerCase().includes(searchContent) ||
      String(coupon.coupon_discount).includes(searchContent)
    )
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="container">
      {/* 搜尋表單 */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <Form.Group>
              <Form.Label>關鍵字搜尋</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="請輸入優惠券關鍵字"
              />
            </Form.Group>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: '#805AF5',
                borderColor: '#805AF5',
                color: 'white',
              }}
              className="me-2"
            >
              搜尋
            </Button>
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                清除
              </Button>
            )}
          </div>
        </div>
      </Form>

      {/* 優惠券列表 */}
      <div className="row g-4">
        {filteredCoupons.length === 0 ? (
          <div className="col-12 text-center py-4">
            <p className="text-muted">
              {searchTerm ? '找不到符合的優惠券' : '目前沒有可用的優惠券'}
            </p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => (
            <div
              key={coupon.coupon_id}
              className="col-md-6 coupon-item"
              onClick={() => handleClaimCoupon(coupon.coupon_id)}
            >
              {coupon.valid === 0 ? (
                <Coupon2
                  coupon_id={coupon.coupon_id}
                  coupon_code={coupon.coupon_code}
                  coupon_content={coupon.coupon_content}
                  coupon_discount={coupon.coupon_discount}
                  discount_method={coupon.discount_method}
                  coupon_start_time={coupon.coupon_start_time}
                  coupon_end_time={coupon.coupon_end_time}
                />
              ) : (
                <Coupon
                  coupon_id={coupon.coupon_id}
                  coupon_code={coupon.coupon_code}
                  coupon_content={coupon.coupon_content}
                  coupon_discount={coupon.coupon_discount}
                  discount_method={coupon.discount_method}
                  coupon_start_time={coupon.coupon_start_time}
                  coupon_end_time={coupon.coupon_end_time}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
