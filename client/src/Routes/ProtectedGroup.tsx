import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import {
  CatchupPage,
  ChatDetailPage,
  ChatListPage,
  ConnectionsPage,
  CreateEventsPage,
  CreateGroupPage,
  Dashboard,
  EditJobsPage,
  EventDetailsPage,
  EventPage,
  FollowerPage,
  FollowingPage,
  GroupRequestPage,
  GrowPage,
  HomePage,
  JobDetailsPage,
  JobPostingPage,
  ManageMyNetworksPage,
  MyjobsPage,
  RecievedPage,
  SentPage,
  SignOutPage,
  YourGroupPage,
} from "../pages";
import {
  FollowLayout,
  GroupLayout,
  InvitationManagerLayout,
  MyNetworkLayout,
} from "../layout";

export const ProtectedGroup = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route index element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signout" element={<SignOutPage />} />
      // networks
      <Route path="/networks">
        <Route element={<MyNetworkLayout />}>
          <Route path="grow" element={<GrowPage />} />
          <Route path="catchup" element={<CatchupPage />} />
        </Route>
        <Route path="manage" element={<ManageMyNetworksPage />} />
        // connections
        <Route path="connections" element={<ConnectionsPage />} />
        // follow
        <Route element={<FollowLayout />}>
          <Route path="following" element={<FollowingPage />} />
          <Route path="followers" element={<FollowerPage />} />
        </Route>
        // groups
        <Route element={<GroupLayout />}>
          <Route path="groups" element={<YourGroupPage />} />
          <Route path="groups/requests" element={<GroupRequestPage />} />
        </Route>
        <Route path="groups/create" element={<CreateGroupPage />} />
        // invites
        <Route element={<InvitationManagerLayout />}>
          <Route path="recieved" element={<RecievedPage />} />
          <Route path="sent" element={<SentPage />} />
        </Route>
        // event
        <Route path="event" element={<EventPage />} />
        <Route path="event/create" element={<CreateEventsPage />} />
        <Route path="event/:eventId" element={<EventDetailsPage />} />
      </Route>
      // jobs
      <Route path="/my-jobs" element={<MyjobsPage />} />
      <Route path="/jobs/edit/:jobId" element={<EditJobsPage />} />
      <Route path="/jobs/post" element={<JobPostingPage />} />
      <Route path="/jobs/job-details/:jobId" element={<JobDetailsPage />} />
      // message
      <Route path="/chatlist-page" element={<ChatListPage />} />
      <Route path="/chatdetail/:id" element={<ChatDetailPage />} />
    </Route>
  </>
);
