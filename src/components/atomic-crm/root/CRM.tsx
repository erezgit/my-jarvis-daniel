import {
  type CoreAdminProps,
  CustomRoutes,
  localStorageStore,
  Resource,
  type AuthProvider,
  type DataProvider,
} from "ra-core";
import { useEffect } from "react";
import { Route } from "react-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Admin } from "@/components/admin/admin";
import { ForgotPasswordPage } from "@/components/supabase/forgot-password-page";
import { SetPasswordPage } from "@/components/supabase/set-password-page";
import { OAuthConsentPage } from "@/components/supabase/oauth-consent-page";

import contacts from "../contacts";
import leads from "../leads";
import orders from "../orders";
import { Dashboard } from "../dashboard/Dashboard";
import { MobileDashboard } from "../dashboard/MobileDashboard";
import { Layout } from "../layout/Layout";
import { MobileLayout } from "../layout/MobileLayout";
import { SignupPage } from "../login/SignupPage";
import { ConfirmationRequired } from "../login/ConfirmationRequired";
import { ImportPage } from "../misc/ImportPage";
import {
  authProvider as defaultAuthProvider,
  dataProvider as defaultDataProvider,
} from "../providers/supabase";
import { autoLoginAuthProvider } from "../providers/autoLoginAuthProvider";
import members from "../members";
import { SalesAnalytics } from "../analytics/SalesAnalytics";
import { SettingsPage } from "../settings/SettingsPage";
import { BlockLibraryPage } from "../block-library/BlockLibraryPage";
import { UserSnapshotsPage } from "../user-snapshots/UserSnapshotsPage";
import { AppWireframePage } from "../app-wireframe/AppWireframePage";
import { ClinicHome } from "../businesses/ClinicHome";
import { ClinicShirDerekh } from "../businesses/clinic/ClinicShirDerekh";
import { PaamonHome } from "../businesses/PaamonHome";
import { PaamonDashboard } from "../businesses/paamon/PaamonDashboard";
import { PaamonTasks } from "../businesses/paamon/PaamonTasks";
import { PaamonWaitingList } from "../businesses/paamon/PaamonWaitingList";
import { PaamonPhoneScripts } from "../businesses/paamon/PaamonPhoneScripts";
import { PaamonMunicipality } from "../businesses/paamon/PaamonMunicipality";
import { PaamonMarketingContacts } from "../businesses/paamon/PaamonMarketingContacts";
import { PaamonTeacherGuide } from "../businesses/paamon/PaamonTeacherGuide";
import { PaamonPolyphony } from "../businesses/paamon/PaamonPolyphony";
import { PaamonJobPosting } from "../businesses/paamon/PaamonJobPosting";
import { PaamonFirstMeeting } from "../businesses/paamon/PaamonFirstMeeting";
import { PaamonOpeningMessage } from "../businesses/paamon/PaamonOpeningMessage";
import { PaamonTreatmentReport } from "../businesses/paamon/PaamonTreatmentReport";
import { PaamonFlyer } from "../businesses/paamon/PaamonFlyer";
import { TeachingHome } from "../businesses/TeachingHome";
import { LevinskyCourseBooklet } from "../businesses/teaching/LevinskyCourseBooklet";
import { LevinskyGrading } from "../businesses/teaching/LevinskyGrading";
import { LevinskyMaterials } from "../businesses/teaching/LevinskyMaterials";
import { KnowledgeBaseHome } from "../businesses/KnowledgeBaseHome";
import { SelfManagementPage } from "../businesses/SelfManagementPage";
import type { ConfigurationContextValue } from "./ConfigurationContext";
import { ConfigurationProvider, useConfigurationContext } from "./ConfigurationContext";
import {
  defaultContactGender,
  defaultDarkModeLogo,
  defaultLightModeLogo,
  defaultNoteStatuses,
  defaultTaskTypes,
  defaultTitle,
  defaultLifecycleStages,
  defaultLeadSources,
  defaultOrderStages,
  defaultActivityStatuses,
  defaultQualificationStatuses,
  defaultReadinessLevels,
  defaultLostReasons,
  defaultFeatures,
} from "./defaultConfiguration";
import { i18nProvider } from "./i18nProvider";
import { StartPage } from "../login/StartPage.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { MobileTasksList } from "../tasks/MobileTasksList.tsx";
import { GtdTasksPage } from "../tasks/GtdTasksPage.tsx";
import { ContactListMobile } from "../contacts/ContactList.tsx";
import { ContactShow } from "../contacts/ContactShow.tsx";
import { NoteShowPage } from "../notes/NoteShowPage.tsx";

export type CRMProps = {
  dataProvider?: DataProvider;
  authProvider?: AuthProvider;
  singleUserMode?: boolean;
  disableTelemetry?: boolean;
} & Partial<ConfigurationContextValue>;

/**
 * CRM Component
 *
 * This component sets up and renders the main CRM application using `ra-core`. It provides
 * default configurations and themes but allows for customization through props. The component
 * wraps the application with a `ConfigurationProvider` to provide configuration values via context.
 *
 * @param {Array<ContactGender>} contactGender - The gender options for contacts used in the application.
 * @param {RaThemeOptions} darkTheme - The theme to use when the application is in dark mode.
 * @param {RaThemeOptions} lightTheme - The theme to use when the application is in light mode.
 * @param {string} logo - The logo used in the CRM application.
 * @param {NoteStatus[]} noteStatuses - The statuses of notes used in the application.
 * @param {string[]} taskTypes - The types of tasks used in the application.
 * @param {string} title - The title of the CRM application.
 *
 * @returns {JSX.Element} The rendered CRM application.
 *
 * @example
 * // Basic usage of the CRM component
 * import { CRM } from '@/components/atomic-crm/dashboard/CRM';
 *
 * const App = () => (
 *     <CRM
 *         logo="/path/to/logo.png"
 *         title="My Custom CRM"
 *         lightTheme={{
 *             ...defaultTheme,
 *             palette: {
 *                 primary: { main: '#0000ff' },
 *             },
 *         }}
 *     />
 * );
 *
 * export default App;
 */
export const CRM = ({
  contactGender = defaultContactGender,
  darkModeLogo = defaultDarkModeLogo,
  lightModeLogo = defaultLightModeLogo,
  noteStatuses = defaultNoteStatuses,
  taskTypes = defaultTaskTypes,
  title = defaultTitle,
  lifecycleStages = defaultLifecycleStages,
  leadSources = defaultLeadSources,
  orderStages = defaultOrderStages,
  activityStatuses = defaultActivityStatuses,
  qualificationStatuses = defaultQualificationStatuses,
  readinessLevels = defaultReadinessLevels,
  lostReasons = defaultLostReasons,
  features = defaultFeatures,
  dataProvider = defaultDataProvider,
  authProvider: authProviderProp,
  singleUserMode = import.meta.env.VITE_SINGLE_USER_MODE === "true",
  googleWorkplaceDomain = import.meta.env.VITE_GOOGLE_WORKPLACE_DOMAIN,
  disableEmailPasswordAuthentication = import.meta.env
    .VITE_DISABLE_EMAIL_PASSWORD_AUTHENTICATION === "true",
  disableTelemetry,
  ...rest
}: CRMProps) => {
  const authProvider = authProviderProp ?? (singleUserMode ? autoLoginAuthProvider : defaultAuthProvider);
  useEffect(() => {
    if (
      disableTelemetry ||
      process.env.NODE_ENV !== "production" ||
      typeof window === "undefined" ||
      typeof window.location === "undefined" ||
      typeof Image === "undefined"
    ) {
      return;
    }
    const img = new Image();
    img.src = `https://atomic-crm-telemetry.marmelab.com/atomic-crm-telemetry?domain=${window.location.hostname}`;
  }, [disableTelemetry]);

  const isMobile = useIsMobile();

  const ResponsiveAdmin = isMobile ? MobileAdmin : DesktopAdmin;

  return (
    <ConfigurationProvider
      contactGender={contactGender}
      darkModeLogo={darkModeLogo}
      lightModeLogo={lightModeLogo}
      noteStatuses={noteStatuses}
      taskTypes={taskTypes}
      title={title}
      lifecycleStages={lifecycleStages}
      leadSources={leadSources}
      orderStages={orderStages}
      activityStatuses={activityStatuses}
      qualificationStatuses={qualificationStatuses}
      readinessLevels={readinessLevels}
      lostReasons={lostReasons}
      features={features}
      googleWorkplaceDomain={googleWorkplaceDomain}
      disableEmailPasswordAuthentication={disableEmailPasswordAuthentication}
    >
      <ResponsiveAdmin
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        store={localStorageStore(undefined, "CRM")}
        loginPage={singleUserMode ? false : StartPage}
        requireAuth={!singleUserMode}
        disableTelemetry
        {...rest}
      />
    </ConfigurationProvider>
  );
};

const DesktopAdmin = (props: CoreAdminProps) => {
  const { features } = useConfigurationContext();
  return (
    <Admin layout={Layout} dashboard={Dashboard} {...props}>
      <CustomRoutes noLayout>
        <Route path={SignupPage.path} element={<SignupPage />} />
        <Route
          path={ConfirmationRequired.path}
          element={<ConfirmationRequired />}
        />
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
        <Route path={OAuthConsentPage.path} element={<OAuthConsentPage />} />
      </CustomRoutes>

      <CustomRoutes>
        <Route path={GtdTasksPage.path} element={<GtdTasksPage />} />
        <Route path={SettingsPage.path} element={<SettingsPage />} />
        <Route path={ImportPage.path} element={<ImportPage />} />
        <Route path={BlockLibraryPage.path} element={<BlockLibraryPage />} />
        <Route path={UserSnapshotsPage.path} element={<UserSnapshotsPage />} />
        <Route path={AppWireframePage.path} element={<AppWireframePage />} />
        {/* Business home pages */}
        <Route path={ClinicHome.path} element={<ClinicHome />} />
        <Route path={ClinicShirDerekh.path} element={<ClinicShirDerekh />} />
        <Route path="/clinic/*" element={<ClinicHome />} />
        <Route path={PaamonHome.path} element={<PaamonHome />} />
        <Route path={PaamonDashboard.path} element={<PaamonDashboard />} />
        <Route path={PaamonTasks.path} element={<PaamonTasks />} />
        <Route path={PaamonWaitingList.path} element={<PaamonWaitingList />} />
        <Route path={PaamonPhoneScripts.path} element={<PaamonPhoneScripts />} />
        <Route path={PaamonMunicipality.path} element={<PaamonMunicipality />} />
        <Route path={PaamonMarketingContacts.path} element={<PaamonMarketingContacts />} />
        <Route path={PaamonTeacherGuide.path} element={<PaamonTeacherGuide />} />
        <Route path={PaamonJobPosting.path} element={<PaamonJobPosting />} />
        <Route path={PaamonFirstMeeting.path} element={<PaamonFirstMeeting />} />
        <Route path={PaamonOpeningMessage.path} element={<PaamonOpeningMessage />} />
        <Route path={PaamonTreatmentReport.path} element={<PaamonTreatmentReport />} />
        <Route path={PaamonFlyer.path} element={<PaamonFlyer />} />
        <Route path={PaamonPolyphony.path} element={<PaamonPolyphony />} />
        <Route path="/paamon/*" element={<PaamonHome />} />
        <Route path={TeachingHome.path} element={<TeachingHome />} />
        <Route path={LevinskyCourseBooklet.path} element={<LevinskyCourseBooklet />} />
        <Route path={LevinskyGrading.path} element={<LevinskyGrading />} />
        <Route path={LevinskyMaterials.path} element={<LevinskyMaterials />} />
        <Route path="/teaching/*" element={<TeachingHome />} />
        <Route path={KnowledgeBaseHome.path} element={<KnowledgeBaseHome />} />
        <Route path="/kb/*" element={<KnowledgeBaseHome />} />
        <Route path={SelfManagementPage.path} element={<SelfManagementPage />} />
        {features.analytics && (
          <Route path="/analytics" element={<SalesAnalytics />} />
        )}
      </CustomRoutes>
      {features.contacts && <Resource name="contacts" {...contacts} />}
      {features.leads && <Resource name="leads" {...leads} />}
      {features.companies && <Resource name="companies" />}
      {features.notes && <Resource name="contact_notes" />}
      {features.tasks && <Resource name="tasks" />}
      {features.members && <Resource name="members" {...members} />}
      {features.tags && <Resource name="tags" />}
      {features.orders && <Resource name="orders" {...orders} />}
    </Admin>
  );
};

const MobileAdmin = (props: CoreAdminProps) => {
  const { features } = useConfigurationContext();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: localStorage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <Admin
        queryClient={queryClient}
        layout={MobileLayout}
        dashboard={MobileDashboard}
        {...props}
      >
        <CustomRoutes noLayout>
          <Route path={SignupPage.path} element={<SignupPage />} />
          <Route
            path={ConfirmationRequired.path}
            element={<ConfirmationRequired />}
          />
          <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
          <Route
            path={ForgotPasswordPage.path}
            element={<ForgotPasswordPage />}
          />
          <Route path={OAuthConsentPage.path} element={<OAuthConsentPage />} />
        </CustomRoutes>
        {features.contacts && (
          <Resource
            name="contacts"
            list={ContactListMobile}
            show={ContactShow}
            recordRepresentation={contacts.recordRepresentation}
          >
            <Route path=":id/notes/:noteId" element={<NoteShowPage />} />
          </Resource>
        )}
        {features.companies && <Resource name="companies" />}
        {features.tasks && <Resource name="tasks" list={MobileTasksList} />}
      </Admin>
    </PersistQueryClientProvider>
  );
};
