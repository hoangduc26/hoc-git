import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CONSTANT_ROUTE } from 'utils/constants';
import { ProtectedRoutes, PublicRoutes } from './authentication';
import RedirectError from './RedirectError';

const Login = React.lazy(() => import('pages/Login'));
const MainMenu = React.lazy(() => import('pages/MainMenu'));
const CollectedQuantity = React.lazy(() => import('pages/CollectedQuantity'));
const WorkSelection = React.lazy(() => import('pages/WorkSelection'));
const SiteNotes = React.lazy(() => import('pages/SiteNotes'));

const SelectVehicle = React.lazy(() => import('pages/SelectVehicle'));
const SystemSetting = React.lazy(() => import('pages/SystemSetting'));
const CarryInList = React.lazy(() => import('pages/CarryIn/List'));
const CarryInInput = React.lazy(() => import('pages/CarryIn/Input'));
const CollectionRecordInput = React.lazy(() => import('pages/CollectionRecordInput'));
const CollectionSiteInformation = React.lazy(() => import('pages/CollectionSiteInformation'));
const FacilityInformation = React.lazy(() => import('pages/FacilityInformation'));
const PastComplaints = React.lazy(() => import('pages/PastComplaints'));
const CollectionContainer = React.lazy(() => import('pages/CollectionContainer'));
const SiteNoteInput = React.lazy(() => import('pages/SiteNoteInput'));
const OperationStatus = React.lazy(() => import('pages/OperationStatus'));
const SubstituteWorkSettingSpot = React.lazy(() => import('pages/SubstituteWorkSettingSpot'));
const SubtituteWorkSettingCourse = React.lazy(() => import('pages/SubstituteWorkSettingCourse'));
const DispatchStatus = React.lazy(() => import('pages/DispatchStatus'));
const CollectionContainerInput = React.lazy(() => import('pages/CollectionContainerInput'));
const WeighingInformationSelection = React.lazy(() => import('pages/WeighingInformationSelection'));
const ReceiptRecordList = React.lazy(() => import('pages/ReceiptRecord/List'));
const ReceiptRecordInput = React.lazy(() => import('pages/ReceiptRecord/Input'));
const PastComplaintDetail = React.lazy(() => import('pages/PastComplaintDetail'));
const ManifestRegister = React.lazy(() => import('pages/manifest/ManifestRegister'));
const ManifestConfirm = React.lazy(() => import('pages/manifest/ManifestConfirm'));
const Contracts = React.lazy(() => import('pages/Contracts'));
const ContractDetail = React.lazy(() => import('pages/ContractDetail'));
const RoomChat = React.lazy(() => import('pages/Chat/RoomChat'));
const GroupsChatList = React.lazy(() => import('pages/Chat/GroupsChat/List'));
const GroupsChatInput = React.lazy(() => import('pages/Chat/GroupsChat/Input'));

const BunkaiToChuukan = React.lazy(() => import('pages/BunkaiToChuukan'));
const RoutesContainer = () => (
    <Suspense fallback={<Spin />}>
        <Routes>
            {/** Protected Routes */}
            <Route path='/' element={<ProtectedRoutes />}>
                <Route path='/' element={<Navigate replace to={CONSTANT_ROUTE.SELECT_VEHICLE} />} />
                <Route path={CONSTANT_ROUTE.MAIN_MENU} element={<MainMenu />} />
                <Route path={CONSTANT_ROUTE.COLLECTED_SUMMARY} element={<CollectedQuantity />} />
                <Route path={CONSTANT_ROUTE.SELECT_VEHICLE} element={<SelectVehicle />} />
                <Route path={CONSTANT_ROUTE.SYSTEM_SETTING} element={<SystemSetting />} />
                <Route
                    path={CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}
                    element={<CollectionRecordInput />}
                />
                <Route path={CONSTANT_ROUTE.WORK_SELECTION} element={<WorkSelection />} />
                <Route path={CONSTANT_ROUTE.SITE_NOTES} element={<SiteNotes />} />

                <Route
                    path={CONSTANT_ROUTE.FACILITY_INFORMATION}
                    element={<FacilityInformation />}
                />
                <Route path={CONSTANT_ROUTE.PAST_COMPLAINTS} element={<PastComplaints />} />
                {/* GROUP */}
                <Route path={CONSTANT_ROUTE.CARRY_IN_LIST} element={<CarryInList />} />
                <Route path={CONSTANT_ROUTE.CARRY_IN_INPUT} element={<CarryInInput />} />

                <Route
                    path={CONSTANT_ROUTE.COLLECTION_CONTAINER}
                    element={<CollectionContainer />}
                />
                <Route path={CONSTANT_ROUTE.SITE_NOTE_INPUT} element={<SiteNoteInput />} />
                <Route path={CONSTANT_ROUTE.OPERATION_STATUS} element={<OperationStatus />} />
                <Route
                    path={CONSTANT_ROUTE.SUBTITUTE_WORK_SETTING_SPOT}
                    element={<SubstituteWorkSettingSpot />}
                />
                <Route
                    path={CONSTANT_ROUTE.SUBTITUTE_WORK_SETTING_COURSE}
                    element={<SubtituteWorkSettingCourse />}
                />

                <Route path={CONSTANT_ROUTE.DISPATCH_STATUS} element={<DispatchStatus />} />
                <Route
                    path={CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT}
                    element={<CollectionContainerInput />}
                />
                <Route
                    path={CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}
                    element={<WeighingInformationSelection />}
                />
                <Route path={CONSTANT_ROUTE.RECEIPT_RECORD_LIST} element={<ReceiptRecordList />} />
                <Route
                    path={CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}
                    element={<ReceiptRecordInput />}
                />

                <Route
                    path={CONSTANT_ROUTE.COLLECTION_SITE_INFORMATION}
                    element={<CollectionSiteInformation />}
                />

                <Route
                    path={CONSTANT_ROUTE.PAST_COMPLAINT_DETAIL}
                    element={<PastComplaintDetail />}
                />

                <Route path={CONSTANT_ROUTE.MANIFEST_REGISTER} element={<ManifestRegister />} />
                <Route path={CONSTANT_ROUTE.MANIFEST_CONFIRM} element={<ManifestConfirm />} />
                <Route path={CONSTANT_ROUTE.CONTRACTS} element={<Contracts />} />
                <Route path={CONSTANT_ROUTE.CONTRACT_DETAIL} element={<ContractDetail />} />
                <Route path={CONSTANT_ROUTE.ROOM_CHAT} element={<RoomChat />} />
                <Route path={CONSTANT_ROUTE.GROUP_CHAT_LIST} element={<GroupsChatList />} />
                <Route path={CONSTANT_ROUTE.GROUP_CHAT_INPUT} element={<GroupsChatInput />} />
                <Route path={CONSTANT_ROUTE.BUNKAI_TO_CHUUKAN} element={<BunkaiToChuukan />} />
            </Route>

            {/** Public Routes */}
            <Route path='login' element={<PublicRoutes />}>
                <Route path='/login' element={<Login />} />
            </Route>

            <Route path='*' element={<RedirectError />} />
        </Routes>
    </Suspense>
);

export default RoutesContainer;
