"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  ArrowUpRight,
  CircleLetterC,
  Clock,
  CircleXmark,
  CreditCard,
  Receipt,
} from "@gravity-ui/icons";
import { getTransactionsByUser } from "@/lib/actions/users";

const statusConfig = {
  paid: {
    label: "Successful",
    icon: CircleLetterC,
    className: "text-green-600 bg-green-500/10 border-green-500/20",
  },

  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  },

  failed: {
    label: "Failed",
    icon: CircleXmark,
    className: "text-red-600 bg-red-500/10 border-red-500/20",
  },

  refunded: {
    label: "Refunded",
    icon: CircleXmark,
    className: "text-orange-600 bg-orange-500/10 border-orange-500/20",
  },
};

const TransactionHistoryPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = session?.user?.id;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

useEffect(() => {
  if (sessionLoading) return;

  if (!userId) {
    setLoading(false);
    return;
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactionsByUser(userId);

      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (error) {
      console.error("Transaction fetch error:", error);

      setError("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  fetchTransactions();
}, [userId, sessionLoading]);


  // Summary calculations

  const totalTransactions = transactions.length;

  const totalSpent = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.paymentStatus === "paid")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );
  }, [transactions]);

  const successfulPayments = useMemo(() => {
    return transactions.filter((transaction) => transaction.status === "paid")
      .length;
  }, [transactions]);

  // Date formatter

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Amount formatter

  const formatAmount = (amount, currency = "bdt") => {
    const symbol = currency.toLowerCase() === "bdt" ? "৳" : "";

    return `${symbol}${Number(amount || 0).toLocaleString("en-BD")}`;
  };


  // Loading

  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-3 h-12 w-12 animate-pulse rounded-2xl bg-muted" />
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>

          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </main>
    );
  }

  // User not logged in

  if (!userId) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">Please login first</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              You need to be logged in to view your transaction history.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted">
            <Receipt className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Transaction History
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            View and track all your ticket payment transactions.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Transactions */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Transactions</p>

            <h2 className="mt-2 text-2xl font-semibold">{totalTransactions}</h2>
          </div>

          {/* Total Spent */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Spent</p>

            <h2 className="mt-2 text-2xl font-semibold">
              ৳{totalSpent.toLocaleString("en-BD")}
            </h2>
          </div>

          {/* Successful Payments */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Successful Payments</p>

            <h2 className="mt-2 text-2xl font-semibold">
              {successfulPayments}
            </h2>
          </div>
        </div>

        {/* Empty State */}
        {!transactions.length && !error && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">No transactions yet</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Your ticket payment history will appear here.
            </p>
          </div>
        )}

        {/* Transaction List */}
        {transactions.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Desktop Header */}
            <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr] gap-4 border-b border-border bg-muted/40 px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
              <span>Transaction</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Payment Method</span>
              <span>Status</span>
            </div>

            {/* Transactions */}
            <div className="divide-y divide-border">
              {transactions.map((transaction) => {
                const status =
                  statusConfig[transaction.paymentStatus] ||
                  statusConfig.pending;

                const StatusIcon = status.icon;

                return (
                  <div
                    key={transaction._id || transaction.transactionId}
                    className="group px-5 py-5 transition-colors hover:bg-muted/30 sm:px-6"
                  >
                    {/* Desktop */}
                    <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr] items-center gap-4 lg:grid">
                      {/* Transaction */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <CreditCard className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {transaction.ticketId?.title ||
                                transaction.ticketName ||
                                "Ticket Payment"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {transaction.transactionId || transaction._id}
                              {" · "}
                              {transaction.ticketId?.type ||
                                transaction.category ||
                                "Ticket"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>

                      {/* Amount */}
                      <p className="font-semibold">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>

                      {/* Payment Method */}
                      <p className="text-sm text-muted-foreground">
                        {transaction.paymentMethod || "Card"}
                      </p>

                      {/* Status */}
                      <div
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />

                        {status.label}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <CreditCard className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {transaction.ticketId?.title ||
                                transaction.ticketName ||
                                "Ticket Payment"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {transaction.transactionId || transaction._id}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 font-semibold">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency,
                          )}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>
                          {transaction.ticketId?.type ||
                            transaction.category ||
                            "Ticket"}
                        </span>

                        <span>{formatDate(transaction.createdAt)}</span>

                        <span>{transaction.paymentMethod || "Card"}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />

                          {status.label}
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
                        >
                          View details
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default TransactionHistoryPage;
