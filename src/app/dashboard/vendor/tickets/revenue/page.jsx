"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChartBar,
  CircleCheck,
  CircleXmark,
  Clock,
  CreditCard,
  ArrowRotateRight,
  Ticket,
} from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-BD").format(Number(number) || 0);
};

const RevenuePage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const user = session?.user;

  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [dateRange, setDateRange] = useState("30");

  const fetchRevenue = useCallback(
    async (showRefresh = false) => {
      if (!user?.email) return;

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          `${API_URL}/api/vendor-revenue?vendorEmail=${encodeURIComponent(
            user.email,
          )}&range=${dateRange}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }

        const data = await response.json();

        if (!data?.success) {
          throw new Error(
            data?.message || "Failed to load revenue information",
          );
        }

        setRevenueData(data);
      } catch (err) {
        console.error("Revenue fetch error:", err);
        setError(err?.message || "Something went wrong while loading revenue.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.email, dateRange],
  );

  useEffect(() => {
    if (!user?.email) return;

    fetchRevenue();
  }, [user?.email, dateRange, fetchRevenue]);

  const stats = useMemo(() => {
    const added = Number(revenueData?.totalTicketsAdded || 0);
    const sold = Number(revenueData?.totalTicketsSold || 0);
    const revenue = Number(revenueData?.totalRevenue || 0);

    const averageRevenue = sold > 0 ? revenue / sold : 0;

    const sellThroughRate = added > 0 ? Math.min((sold / added) * 100, 100) : 0;

    return {
      added,
      sold,
      revenue,
      averageRevenue,
      sellThroughRate,
    };
  }, [revenueData]);

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading revenue dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-[70vh] bg-white px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-center gap-3">
            <CircleXmark className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">
                Unable to load vendor information
              </h3>
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                Please login again and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Vendor Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Revenue Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track your ticket sales, revenue and payment performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 1 year</option>
              <option value="all">All time</option>
            </select>

            <button
              onClick={() => fetchRevenue(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ArrowRotateRight
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <CircleXmark className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <p className="font-semibold text-red-700 dark:text-red-400">
                  Unable to load revenue
                </p>

                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Tickets Added"
            value={formatNumber(stats.added)}
            subtitle="Total tickets listed"
            icon={<Ticket className="h-5 w-5" />}
            loading={loading}
          />

          <StatCard
            title="Tickets Sold"
            value={formatNumber(stats.sold)}
            subtitle="Successfully paid tickets"
            icon={<CircleCheck className="h-5 w-5" />}
            loading={loading}
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue)}
            subtitle="From successful payments"
            icon={<CreditCard className="h-5 w-5" />}
            loading={loading}
          />

          <StatCard
            title="Avg. Revenue / Sale"
            value={formatCurrency(stats.averageRevenue)}
            subtitle={`${stats.sellThroughRate.toFixed(1)}% sell-through rate`}
            icon={<ChartBar className="h-5 w-5" />}
            loading={loading}
          />
        </section>

        {/* Main charts */}
        <section className="grid gap-6 xl:grid-cols-3">
          {/* Revenue chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-bold">Revenue Trend</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your revenue performance over the selected period.
              </p>
            </div>

            <RevenueChart
              data={revenueData?.monthlyRevenue || []}
              loading={loading}
            />
          </div>

          {/* Ticket performance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <h2 className="text-lg font-bold">Ticket Performance</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Added vs successfully sold tickets.
              </p>
            </div>

            <TicketPerformance
              added={stats.added}
              sold={stats.sold}
              loading={loading}
            />
          </div>
        </section>

        {/* Recent transactions */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold">Recent Transactions</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest successful payments for your tickets.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CircleCheck className="h-4 w-4 text-emerald-500" />
              Successful payments
            </div>
          </div>

          <RecentTransactions
            transactions={revenueData?.recentTransactions || []}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
};

/* ---------------------------------- */
/* Stat Card */
/* ---------------------------------- */

const StatCard = ({ title, value, subtitle, icon, loading }) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ) : (
            <h3 className="mt-2 text-2xl font-bold tracking-tight">{value}</h3>
          )}

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Revenue Chart */
/* ---------------------------------- */

const RevenueChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex h-[300px] items-end gap-3">
        {[40, 60, 45, 75, 55, 85, 65, 90].map((height, index) => (
          <div
            key={index}
            className="flex-1 animate-pulse rounded-t-lg bg-slate-200 dark:bg-slate-800"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return <EmptyChart message="No revenue data available yet." />;
  }

  const maxRevenue = Math.max(
    ...data.map((item) => Number(item.revenue || 0)),
    1,
  );

  return (
    <div className="space-y-4">
      <div className="flex h-[300px] items-end gap-2 overflow-x-auto pb-8 sm:gap-3">
        {data.map((item, index) => {
          const revenue = Number(item.revenue || 0);

          const height = Math.max(
            (revenue / maxRevenue) * 100,
            revenue > 0 ? 4 : 0,
          );

          return (
            <div
              key={`${item.month}-${index}`}
              className="group flex min-w-[42px] flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="relative flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-[42px] rounded-t-lg bg-blue-600 transition-all duration-500 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                  style={{ height: `${height}%` }}
                  title={formatCurrency(revenue)}
                />
              </div>

              <span className="whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Selected period
        </span>

        <span className="font-semibold">
          {formatCurrency(
            data.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
          )}
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Ticket Performance */
/* ---------------------------------- */

const TicketPerformance = ({ added, sold, loading }) => {
  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-44 w-44 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!added && !sold) {
    return <EmptyChart message="No ticket data available yet." />;
  }

  const percentage = added > 0 ? Math.min((sold / added) * 100, 100) : 0;

  return (
    <div className="flex h-[300px] flex-col items-center justify-center">
      <div
        className="relative flex h-48 w-48 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(
            rgb(37 99 235) ${percentage}%,
            rgb(226 232 240) ${percentage}% 100%
          )`,
        }}
      >
        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
          <span className="text-3xl font-bold">{percentage.toFixed(1)}%</span>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sold rate
          </span>
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">Added</p>
          <p className="mt-1 text-lg font-bold">{formatNumber(added)}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
          <p className="text-xs text-blue-600 dark:text-blue-400">Sold</p>
          <p className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-300">
            {formatNumber(sold)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Recent Transactions */
/* ---------------------------------- */

const RecentTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 p-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
        <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
          <CreditCard className="h-7 w-7 text-slate-400" />
        </div>

        <h3 className="mt-4 font-semibold">No transactions yet</h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Successful ticket payments will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {transactions.slice(0, 8).map((transaction, index) => (
        <div
          key={transaction._id || transaction.id || index}
          className="flex flex-col gap-3 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/40"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <CircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {transaction.ticketName ||
                  transaction.ticketId ||
                  "Ticket purchase"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{transaction.userEmail || "Customer"}</span>

                {transaction.createdAt && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-BD",
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(transaction.amount)}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Payment successful
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------- */
/* Empty Chart */
/* ---------------------------------- */

const EmptyChart = ({ message }) => {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
        <ChartBar className="h-7 w-7 text-slate-400" />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        {message}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
        Your statistics will appear here after ticket activity.
      </p>
    </div>
  );
};

export default RevenuePage;
