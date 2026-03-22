import streamlit as st
import json
import os
from datetime import datetime, date, timedelta
import calendar

# ─────────────────────────────────────────
# 설정 및 데이터 파일 경로
# ─────────────────────────────────────────
DATA_FILE = "reservations.json"
ROOMS_FILE = "rooms.json"

# ─────────────────────────────────────────
# 기본 회의실 목록 (최초 실행 시 생성)
# ─────────────────────────────────────────
DEFAULT_ROOMS = [
    {"id": "A101", "name": "회의실 A (1층)", "capacity": 6,  "equipment": ["프로젝터", "화이트보드"]},
    {"id": "B201", "name": "회의실 B (2층)", "capacity": 10, "equipment": ["TV", "화이트보드", "화상회의"]},
    {"id": "C301", "name": "대회의실 (3층)", "capacity": 20, "equipment": ["프로젝터", "마이크", "화상회의"]},
    {"id": "D102", "name": "소회의실 (1층)", "capacity": 4,  "equipment": ["TV"]},
]

# ─────────────────────────────────────────
# 데이터 로드 / 저장 함수
# ─────────────────────────────────────────
def load_rooms():
    if os.path.exists(ROOMS_FILE):
        with open(ROOMS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    with open(ROOMS_FILE, "w", encoding="utf-8") as f:
        json.dump(DEFAULT_ROOMS, f, ensure_ascii=False, indent=2)
    return DEFAULT_ROOMS

def load_reservations():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_reservations(reservations):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(reservations, f, ensure_ascii=False, indent=2)

# ─────────────────────────────────────────
# 예약 충돌 검사 함수
# ─────────────────────────────────────────
def is_conflict(reservations, room_id, res_date, start_time, end_time, exclude_id=None):
    for r in reservations:
        if r["id"] == exclude_id:
            continue
        if r["room_id"] != room_id or r["date"] != res_date:
            continue
        # 시간 겹침 검사
        if r["start_time"] < end_time and r["end_time"] > start_time:
            return True, r
    return False, None

# ─────────────────────────────────────────
# 시간 옵션 생성 (30분 단위)
# ─────────────────────────────────────────
def get_time_options():
    times = []
    for h in range(8, 20):
        for m in [0, 30]:
            times.append(f"{h:02d}:{m:02d}")
    times.append("20:00")
    return times

# ─────────────────────────────────────────
# 페이지 설정
# ─────────────────────────────────────────
st.set_page_config(
    page_title="회의실 예약 시스템",
    page_icon="🏢",
    layout="wide"
)

# CSS 스타일
st.markdown("""
<style>
    .room-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        border-left: 4px solid #4A90E2;
    }
    .reservation-item {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
    }
    .status-available { color: #27ae60; font-weight: bold; }
    .status-busy { color: #e74c3c; font-weight: bold; }
    .calendar-header { text-align: center; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────
# 데이터 초기화
# ─────────────────────────────────────────
rooms = load_rooms()
reservations = load_reservations()
room_map = {r["id"]: r for r in rooms}

# ─────────────────────────────────────────
# 사이드바 - 사용자 이름 입력
# ─────────────────────────────────────────
st.sidebar.title("🏢 회의실 예약")
st.sidebar.markdown("---")
user_name = st.sidebar.text_input("👤 내 이름", placeholder="이름을 입력하세요", key="user_name")
st.sidebar.markdown("---")

menu = st.sidebar.radio(
    "메뉴",
    ["📋 회의실 현황", "📅 예약하기", "🗓️ 달력으로 보기", "📝 내 예약 관리"]
)

# ─────────────────────────────────────────
# 1. 회의실 현황
# ─────────────────────────────────────────
if menu == "📋 회의실 현황":
    st.title("📋 회의실 현황")
    st.caption(f"오늘: {date.today().strftime('%Y년 %m월 %d일')}")

    today_str = date.today().strftime("%Y-%m-%d")
    now_time = datetime.now().strftime("%H:%M")

    for room in rooms:
        # 현재 시간에 예약된 건 있는지 확인
        busy = any(
            r["room_id"] == room["id"]
            and r["date"] == today_str
            and r["start_time"] <= now_time < r["end_time"]
            for r in reservations
        )
        col1, col2 = st.columns([3, 1])
        with col1:
            st.markdown(f"""
            <div class="room-card">
                <b>🚪 {room['name']}</b><br>
                👥 최대 {room['capacity']}명 &nbsp;|&nbsp; 🖥️ {', '.join(room['equipment'])}
            </div>
            """, unsafe_allow_html=True)
        with col2:
            if busy:
                st.markdown('<p class="status-busy">🔴 사용 중</p>', unsafe_allow_html=True)
            else:
                st.markdown('<p class="status-available">🟢 사용 가능</p>', unsafe_allow_html=True)

    st.markdown("---")
    st.subheader("📌 오늘의 예약 현황")
    today_res = [r for r in reservations if r["date"] == today_str]
    today_res.sort(key=lambda x: (x["room_id"], x["start_time"]))

    if today_res:
        for r in today_res:
            room_name = room_map.get(r["room_id"], {}).get("name", r["room_id"])
            st.markdown(f"""
            <div class="reservation-item">
                🚪 <b>{room_name}</b> &nbsp;|&nbsp;
                🕐 {r['start_time']} ~ {r['end_time']} &nbsp;|&nbsp;
                👤 {r['organizer']} &nbsp;|&nbsp;
                📌 {r['title']}
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("오늘 예약된 회의실이 없습니다.")

# ─────────────────────────────────────────
# 2. 예약하기
# ─────────────────────────────────────────
elif menu == "📅 예약하기":
    st.title("📅 회의실 예약하기")

    if not user_name:
        st.warning("⚠️ 왼쪽 사이드바에서 이름을 먼저 입력해주세요.")
        st.stop()

    time_options = get_time_options()

    with st.form("reservation_form"):
        col1, col2 = st.columns(2)
        with col1:
            room_options = {r["name"]: r["id"] for r in rooms}
            selected_room_name = st.selectbox("🚪 회의실 선택", list(room_options.keys()))
            selected_room_id = room_options[selected_room_name]
            res_date = st.date_input(
                "📅 날짜",
                min_value=date.today(),
                max_value=date.today() + timedelta(days=90)
            )
        with col2:
            meeting_title = st.text_input("📌 회의 제목", placeholder="예: 주간 팀 미팅")
            attendees = st.number_input("👥 참석 인원", min_value=1, max_value=50, value=4)
            start_idx = st.selectbox("⏰ 시작 시간", time_options, index=2)
            end_idx = st.selectbox("⏰ 종료 시간", time_options, index=4)

        memo = st.text_area("📝 메모 (선택사항)", placeholder="회의 목적, 필요한 장비 등", height=80)
        submitted = st.form_submit_button("✅ 예약하기", use_container_width=True)

        if submitted:
            # 유효성 검사
            if not meeting_title:
                st.error("회의 제목을 입력해주세요.")
            elif start_idx >= end_idx:
                st.error("종료 시간은 시작 시간보다 늦어야 합니다.")
            else:
                date_str = res_date.strftime("%Y-%m-%d")
                conflict, conflict_res = is_conflict(
                    reservations, selected_room_id, date_str, start_idx, end_idx
                )
                if conflict:
                    st.error(f"⚠️ 이미 예약된 시간입니다! ({conflict_res['organizer']} / {conflict_res['start_time']}~{conflict_res['end_time']})")
                else:
                    # 예약 저장
                    new_id = f"R{datetime.now().strftime('%Y%m%d%H%M%S')}"
                    new_res = {
                        "id": new_id,
                        "room_id": selected_room_id,
                        "date": date_str,
                        "start_time": start_idx,
                        "end_time": end_idx,
                        "title": meeting_title,
                        "organizer": user_name,
                        "attendees": attendees,
                        "memo": memo,
                        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                    reservations.append(new_res)
                    save_reservations(reservations)
                    st.success(f"✅ 예약 완료! {selected_room_name} / {date_str} {start_idx}~{end_idx}")
                    st.balloons()

# ─────────────────────────────────────────
# 3. 달력으로 보기
# ─────────────────────────────────────────
elif menu == "🗓️ 달력으로 보기":
    st.title("🗓️ 월간 예약 달력")

    col1, col2, col3 = st.columns([1, 2, 1])
    with col1:
        selected_year = st.number_input("년도", min_value=2024, max_value=2030, value=date.today().year)
    with col2:
        month_names = ["1월", "2월", "3월", "4월", "5월", "6월",
                       "7월", "8월", "9월", "10월", "11월", "12월"]
        selected_month = st.selectbox("월", month_names, index=date.today().month - 1)
        month_num = month_names.index(selected_month) + 1
    with col3:
        room_filter_options = ["전체"] + [r["name"] for r in rooms]
        selected_filter = st.selectbox("회의실", room_filter_options)

    # 달력 생성
    cal = calendar.monthcalendar(selected_year, month_num)
    days_kor = ["월", "화", "수", "목", "금", "토", "일"]

    header_cols = st.columns(7)
    for i, day in enumerate(days_kor):
        color = "#e74c3c" if day == "일" else "#4A90E2" if day == "토" else "#333"
        header_cols[i].markdown(f"<div style='text-align:center; font-weight:bold; color:{color}'>{day}</div>", unsafe_allow_html=True)

    for week in cal:
        week_cols = st.columns(7)
        for i, day in enumerate(week):
            with week_cols[i]:
                if day == 0:
                    st.markdown("<div style='min-height:80px'></div>", unsafe_allow_html=True)
                    continue
                day_str = f"{selected_year}-{month_num:02d}-{day:02d}"
                is_today = (day_str == date.today().strftime("%Y-%m-%d"))

                # 해당 날짜 예약 조회
                day_res = [
                    r for r in reservations
                    if r["date"] == day_str and (
                        selected_filter == "전체" or
                        room_map.get(r["room_id"], {}).get("name") == selected_filter
                    )
                ]

                bg = "#FFF9C4" if is_today else "#f8f9fa"
                border = "2px solid #f39c12" if is_today else "1px solid #e0e0e0"
                content = f"<div style='background:{bg}; border:{border}; border-radius:6px; padding:4px; min-height:80px; font-size:12px;'>"
                content += f"<b>{day}</b><br>"
                for r in day_res[:3]:
                    content += f"🔵 {r['start_time']} {r['title'][:6]}<br>"
                if len(day_res) > 3:
                    content += f"<i>+{len(day_res)-3}건 더</i>"
                content += "</div>"
                st.markdown(content, unsafe_allow_html=True)

    # 선택 월 예약 목록
    st.markdown("---")
    st.subheader(f"📋 {selected_month} 전체 예약 목록")
    month_prefix = f"{selected_year}-{month_num:02d}"
    month_res = [
        r for r in reservations
        if r["date"].startswith(month_prefix) and (
            selected_filter == "전체" or
            room_map.get(r["room_id"], {}).get("name") == selected_filter
        )
    ]
    month_res.sort(key=lambda x: (x["date"], x["start_time"]))

    if month_res:
        for r in month_res:
            room_name = room_map.get(r["room_id"], {}).get("name", r["room_id"])
            st.markdown(f"""
            <div class="reservation-item">
                📅 <b>{r['date']}</b> &nbsp;|&nbsp;
                🚪 {room_name} &nbsp;|&nbsp;
                🕐 {r['start_time']}~{r['end_time']} &nbsp;|&nbsp;
                👤 {r['organizer']} &nbsp;|&nbsp;
                📌 {r['title']}
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("이 달에 예약된 회의실이 없습니다.")

# ─────────────────────────────────────────
# 4. 내 예약 관리
# ─────────────────────────────────────────
elif menu == "📝 내 예약 관리":
    st.title("📝 내 예약 관리")

    if not user_name:
        st.warning("⚠️ 왼쪽 사이드바에서 이름을 먼저 입력해주세요.")
        st.stop()

    my_res = [r for r in reservations if r["organizer"] == user_name]
    my_res.sort(key=lambda x: (x["date"], x["start_time"]))

    # 지난 예약 / 앞으로 예약 분리
    today_str = date.today().strftime("%Y-%m-%d")
    upcoming = [r for r in my_res if r["date"] >= today_str]
    past = [r for r in my_res if r["date"] < today_str]

    st.subheader(f"📌 예정된 예약 ({len(upcoming)}건)")
    if upcoming:
        for r in upcoming:
            room_name = room_map.get(r["room_id"], {}).get("name", r["room_id"])
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown(f"""
                <div class="reservation-item">
                    📅 <b>{r['date']}</b> &nbsp;|&nbsp;
                    🚪 {room_name} &nbsp;|&nbsp;
                    🕐 {r['start_time']}~{r['end_time']}<br>
                    📌 {r['title']} &nbsp;|&nbsp; 👥 {r['attendees']}명
                    {f"<br>📝 {r['memo']}" if r.get('memo') else ''}
                </div>
                """, unsafe_allow_html=True)
            with col2:
                if st.button("❌ 취소", key=f"cancel_{r['id']}"):
                    reservations.remove(r)
                    save_reservations(reservations)
                    st.success("예약이 취소되었습니다.")
                    st.rerun()
    else:
        st.info("예정된 예약이 없습니다.")

    if past:
        with st.expander(f"🕐 지난 예약 ({len(past)}건)"):
            for r in reversed(past):
                room_name = room_map.get(r["room_id"], {}).get("name", r["room_id"])
                st.markdown(f"""
                <div class="reservation-item" style="opacity:0.6">
                    📅 {r['date']} | 🚪 {room_name} | 🕐 {r['start_time']}~{r['end_time']} | 📌 {r['title']}
                </div>
                """, unsafe_allow_html=True)
