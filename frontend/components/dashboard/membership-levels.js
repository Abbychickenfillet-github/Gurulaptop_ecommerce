import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import ProgressBar from 'react-bootstrap/ProgressBar'
import axios from 'axios'

export default function MembershipLevels() {
  const { auth } = useAuth()
  const level_chinese = auth?.userData?.level
  const [membershipData, setMembershipData] = useState({
    totalSpent: 0,
    nextLevelRequired: 0,
    created_at: null,
    daysToThreeYears: 0,
  })
  const user_id = auth?.userData?.user_id

  const getMembershipLevel = (totalSpent) => {
    // 確保 totalSpent 是數字
    const spent = Number(totalSpent)
    
    if (spent >= 100000) {
      return '鑽石會員'
    } else if (spent >= 70000) {
      return '金牌會員'
    } else if (spent >= 40000) {
      return '銀牌會員'
    } else if (spent >= 20000) {
      return '銅牌會員'
    } else if (spent >= 0) {
      return '剛註冊'
    } else {
      return '帳號有問題，請聯繫客服'
    }
  }

  const calculateDateProgress = () => {
    if (!membershipData.created_at) return [0, 0, 0, 0]

    const totalDays = 365 * 3 // 3年的總天數
    const daysPassed = totalDays - membershipData.daysToThreeYears
    const progress = (daysPassed / totalDays) * 100

    if (progress >= 75) return [40, 30, 20, 10]
    if (progress >= 50) return [35, 20, 20, 0]
    if (progress >= 25) return [25, 25, 0, 0]
    return [progress, 0, 0, 0]
  }

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/membership/${auth?.userData?.user_id}`
        )
        setMembershipData(response.data)
      } catch (error) {
        console.error('Error fetching membership data:', error)
      }
    }

    if (auth?.userData?.user_id) {
      fetchMembershipData()
    }
  }, [auth?.userData?.user_id])

  const calculateProgress = () => {
    const total = membershipData.totalSpent
    // 計算每個區段的進度值
    if (total >= 100000) {
      return [40, 30, 20, 10] // 總計 100%
    } else if (total >= 70000) {
      return [35, 20, 20, 0] // 總計 75%
    } else if (total >= 40000) {
      return [25, 25, 0, 0] // 總計 50%
    } else if (total >= 20000) {
      return [25, 0, 0, 0] // 總計 25%
    }
    // 低於 20000 的情況
    const progress = (total / 20000) * 25
    return [progress, 0, 0, 0]
  }

  const getVariants = () => {
    return ['success', 'warning', 'danger', 'primary'] // 固定的三種顏色
  }

  // 使用範例:

  const levels = [
    {
      name: '銅牌會員',
      benefits:
        '可於文章區發表文章、參加活動、包膜優惠價(打95折，價值1,000的包膜等於省50元)',
    },
    {
      name: '銀牌會員',
      benefits:
        '可於文章區發表文章、參加活動、包膜優惠價(打95折，價值1,000的包膜等於省50元)',
    },
    {
      name: '金牌會員',
      benefits:
        '可於文章區發表文章、參加活動、送免費新機包膜服務、三節打95折(等於購買30,000的電腦可省500)、電腦包客製化姓名刺繡服務(價值120元)',
    },
    {
      name: '鑽石會員',
      benefits:
        '可於文章區發表文章、參加活動、免費包膜服務(價值1,000)、日後購買新機免費升級延長保固半年、生日禮(抽獎券-可抽筆電支架)',
    },
  ]

  return (
    <div
      className="container py-5"
      style={{
        background: 'linear-gradient(135deg, #6C4CCE 0%, #805AF5 100%)',
      }}
    >
      <style jsx>
        {`
          .membership-card {
            background: linear-gradient(180deg, #6c4cce 0%, #000000 100%);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            height: 100%;
          }
          .membership-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              ellipse at center,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0) 70%
            );
            transform: rotate(-45deg);
            pointer-events: none;
          }
          .active-card {
            opacity: 1;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            transform: scale(1.02);
          .diamond {
            width: 12px;
            height: 12px;
            background-color: #805af5;
            transform: rotate(45deg);
            display: inline-block;
            margin-right: 8px;
          }
        `}
      </style>

      <div className="row mb-4 ">
        <div className="col">
          <h2 className="text-white mb-0 d-flex justify-content-center">
            <span className="diamond"></span>
            會員等級
          </h2>
          <div className="d-flex justify-content-center">
            <h3 className="text-white">
              目前是{getMembershipLevel(level_chinese)}
            </h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3 className="text-white d-flex justify-content-center">累計消費: ${membershipData.totalSpent}</h3>
          <p className="text-white">
            距離下一等級還需消費: ${membershipData.nextLevelRequired}
          </p>
          <ProgressBar>
            {calculateProgress().map((progress, index) => (
              <ProgressBar
                key={index}
                striped={index % 2 === 0} // 隔行條紋效果
                variant={getVariants()[index]}
                now={progress}
              />
            ))}
          </ProgressBar>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3 className="text-white d-flex justify-content-center">
            註冊日期: {new Date(membershipData.created_at).toLocaleDateString()}
          </h3>
          <p className="text-white">
            距離3年會員到期還有: {membershipData.daysToThreeYears} 天
          </p>
          <ProgressBar>
            {calculateDateProgress().map((progress, index) => (
              <ProgressBar
                key={index}
                animated
                striped={index % 2 === 0}
                variant={getVariants()[index]}
                now={progress}
              />
            ))}
          </ProgressBar>
        </div>
      </div>

      {/* 以下是卡片 */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {levels.map((level, index) => (
          <div key={index} className="col">
            <div
              className={`membership-card p-4 d-flex flex-column ${
                level.level === auth?.userData?.level ? 'active-card' : ''
              }`}
            >
              <h3 className="text-white mb-3">{level.name}</h3>
              <p className="text-white flex-grow-1">{level.benefits}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
