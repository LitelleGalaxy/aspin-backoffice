async function requireAdmin() {

  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error || !session) {

    window.location.replace(
      "login.html"
    );

    return null;
  }

  return session;
}


async function loadDashboard() {

  const session =
    await requireAdmin();

  if (!session) return;


  const email =
    document.getElementById(
      "adminEmail"
    );

  if (email) {

    email.textContent =
      session.user.email || "";

  }


  const [
    promotions,
    subscribers,
    registerClicks,
    events
  ] = await Promise.all([

    supabaseClient
      .from("promotions")
      .select("id", {
        count: "exact",
        head: true
      })
      .eq("is_published", true),

    supabaseClient
      .from("subscribers")
      .select("id", {
        count: "exact",
        head: true
      })
      .eq("is_active", true),

    supabaseClient
      .from("analytics_events")
      .select("id", {
        count: "exact",
        head: true
      })
      .eq(
        "event_name",
        "register_click"
      ),

    supabaseClient
      .from("analytics_events")
      .select("id", {
        count: "exact",
        head: true
      })

  ]);


  const firstError =
    [
      promotions,
      subscribers,
      registerClicks,
      events
    ].find(
      result => result.error
    );


  const dbStatus =
    document.getElementById(
      "dbStatus"
    );


  if (firstError) {

    if (dbStatus) {

      dbStatus.textContent =
        "CHECK RLS";

      dbStatus.className =
        "status-warning";

    }

    return;
  }


  if (dbStatus) {

    dbStatus.textContent =
      "CONNECTED";

    dbStatus.className =
      "status-ok";

  }


  const promotionCount =
    document.getElementById(
      "promotionCount"
    );

  if (promotionCount) {

    promotionCount.textContent =
      promotions.count ?? 0;

  }


  const subscriberCount =
    document.getElementById(
      "subscriberCount"
    );

  if (subscriberCount) {

    subscriberCount.textContent =
      subscribers.count ?? 0;

  }


  const registerCount =
    document.getElementById(
      "registerClicks"
    );

  if (registerCount) {

    registerCount.textContent =
      registerClicks.count ?? 0;

  }


  const eventCount =
    document.getElementById(
      "eventCount"
    );

  if (eventCount) {

    eventCount.textContent =
      events.count ?? 0;

  }

}


document
  .getElementById("logoutBtn")
  ?.addEventListener(
    "click",
    async () => {

      await supabaseClient.auth.signOut();

      window.location.replace(
        "login.html"
      );

    }
  );


loadDashboard();