import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { useParallax } from "./hooks/useParallax";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { useModalParallax } from "./hooks/useModalParallax";
import { useBackToTop } from "./hooks/useBackToTop";
import { QweMarkup } from "./qweMarkup";
import ResumePage from "./components/ResumePage";
import { DIAGRAMS, CASES } from "./caseData";

function NodePopover({ nodeRef, open, data, onClose }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    placement: "top",
    ready: false,
  });

  useLayoutEffect(() => {
    if (!open || !nodeRef?.current || !popRef.current) return;
    const margin = 12;
    const offset = 10;
    const rect = nodeRef.current.getBoundingClientRect();
    const popRect = popRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceTop = rect.top - margin;
    const spaceBottom = vh - rect.bottom - margin;
    const spaceRight = vw - rect.right - margin;
    let placement = "top";
    if (popRect.height + offset <= spaceTop) placement = "top";
    else if (popRect.height + offset <= spaceBottom) placement = "bottom";
    else if (popRect.width + offset <= spaceRight) placement = "right";
    else placement = "left";
    let top = 0;
    let left = 0;
    if (placement === "top") {
      top = rect.top - popRect.height - offset;
      left = rect.left + rect.width / 2 - popRect.width / 2;
    } else if (placement === "bottom") {
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2 - popRect.width / 2;
    } else if (placement === "right") {
      top = rect.top + rect.height / 2 - popRect.height / 2;
      left = rect.right + offset;
    } else {
      top = rect.top + rect.height / 2 - popRect.height / 2;
      left = rect.left - popRect.width - offset;
    }
    top = Math.max(margin, Math.min(top, vh - popRect.height - margin));
    left = Math.max(margin, Math.min(left, vw - popRect.width - margin));
    setPos({ top, left, placement, ready: true });
  }, [open, data, nodeRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open, onClose]);

  if (!open || !data) return null;

  const blocks = [];
  if (data.why) {
    blocks.push(
      <div key="why" className="npBlock">
        <div className="npLabel">Why this exists</div>
        <p className="npText">{data.why}</p>
      </div>
    );
  }
  const listBlock = (label, items, key) =>
    items?.length ? (
      <div key={key} className="npBlock">
        <div className="npLabel">{label}</div>
        <ul className="npList">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    ) : null;
  blocks.push(listBlock("How it works", data.how, "how"));
  blocks.push(listBlock("Key design decisions", data.decisions, "decisions"));
  blocks.push(
    listBlock("What I chose NOT to automate", data.notAutomated, "not")
  );
  blocks.push(listBlock("Production considerations", data.production, "prod"));

  const arrowStyle = (() => {
    const style = {};
    if (pos.placement === "top") {
      style.bottom = -6;
      style.left = "50%";
      style.transform = "translateX(-50%) rotate(45deg)";
    } else if (pos.placement === "bottom") {
      style.top = -6;
      style.left = "50%";
      style.transform = "translateX(-50%) rotate(45deg)";
    } else if (pos.placement === "right") {
      style.left = -6;
      style.top = "50%";
      style.transform = "translateY(-50%) rotate(45deg)";
    } else {
      style.right = -6;
      style.top = "50%";
      style.transform = "translateY(-50%) rotate(45deg)";
    }
    return style;
  })();

  return ReactDOM.createPortal(
    <div
      role="tooltip"
      aria-hidden={open ? "false" : "true"}
      id="node-popover"
      className={`nodePopover ${pos.ready ? "show" : ""}`}
      style={{ top: pos.top, left: pos.left }}
      ref={popRef}
    >
      <div className="npArrow" style={arrowStyle} />
      <div className="npBody">
        <div className="npHead">
          <div className="npTitle">{data.title}</div>
          <button
            className="ghostLink npClose"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            Ã—
          </button>
        </div>
        {blocks}
      </div>
    </div>,
    document.body
  );
}

function MainApp() {
  const rootRef = useRef(null);
  const popoverAnchorRef = useRef(null);
  const [popoverData, setPopoverData] = useState(null);
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || nodes) return;

    const select = (sel) => root.querySelector(sel);
    const selectAll = (sel) => Array.from(root.querySelectorAll(sel));

    setNodes({
      scope: root,
      parallax: selectAll("[data-depth]"),
      reveals: selectAll(".reveal"),
      hWrap: select("#hwrap"),
      hScroll: select("#hscroll"),
      csRight: select("#csRight"),
      modalLayers: [select("#csLayer1"), select("#csLayer2")].filter(Boolean),
      toTop: select("#toTop"),
      drawer: select("#drawer"),
      navLinks: selectAll(".navLink"),
      sections: selectAll(".navLink")
        .map((a) => select(a.getAttribute("href")))
        .filter(Boolean),
      progressCards: selectAll("[data-progress]"),
      roadItems: selectAll("[data-rp]"),
      counters: selectAll(".num[data-count]"),
      cards: selectAll(".card, .heroSide"),
      chips: selectAll(".chip"),
      tools: selectAll(".tool"),
      panels: selectAll(".panel"),
      year: select("#year"),
      csModal: select("#csModal"),
      csTitle: select("#csTitle"),
      csLead: select("#csLead"),
      csMeta: select("#csMeta"),
      csRightSection: select("#csRight"),
      menuBtn: select(".menuBtn"),
      drawerLinks: selectAll("#drawer a, #drawer button"),
    });
  }, [nodes]);

  useParallax(nodes?.parallax || []);
  useScrollReveal(nodes?.reveals || []);
  useHorizontalScroll(nodes?.hWrap);
  useModalParallax(nodes?.csRight, nodes?.modalLayers || []);
  useBackToTop(nodes?.toTop);

  useEffect(() => {
    if (!nodes) return undefined;
    const {
      year,
      drawer,
      menuBtn,
      drawerLinks,
      navLinks,
      sections,
      progressCards,
      roadItems,
      counters,
      cards,
      chips,
      tools,
      panels,
      csModal,
      csTitle,
      csLead,
      csMeta,
      csRightSection,
    } = nodes;

    const chipList = chips || [];
    const toolList = tools || [];
    const cardList = cards || [];
    const navLinkList = navLinks || [];
    const sectionList = sections || [];

    if (year) year.textContent = new Date().getFullYear();
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Insert private systems callout below Case Studies heading
    const systemsHeading = nodes.scope?.querySelector("#systems .reveal");
    if (systemsHeading && !systemsHeading.dataset.calloutInserted) {
      const callout = document.createElement("div");
      callout.className = "infoCallout";
      callout.setAttribute("aria-label", "Private systems note");
      callout.innerHTML =
        '<span aria-hidden="true" style="margin-right:8px">&#128274;</span><span>Several systems shown were built under client IP agreements or are part of private production environments. Architecture, decisions, and operational behavior are shared where code cannot be.</span>';
      systemsHeading.insertAdjacentElement("afterend", callout);
      systemsHeading.dataset.calloutInserted = "true";
    }

    // Drawer
    const openDrawer = () => drawer?.classList.add("open");
    const closeDrawer = () => drawer?.classList.remove("open");
    const onDrawerOverlay = (e) => {
      if (e.target === drawer) closeDrawer();
    };
    drawer?.addEventListener("click", onDrawerOverlay);
    menuBtn?.addEventListener("click", openDrawer);
    drawerLinks?.forEach((el) => el.addEventListener("click", closeDrawer));
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;
    window.fakeRead = (e) => e.preventDefault();

    // Active nav highlight
    const navIO = sectionList.length
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              const id = `#${en.target.id}`;
              navLinkList.forEach((a) =>
                a.classList.toggle("active", a.getAttribute("href") === id)
              );
            });
          },
          { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
        )
      : null;
    sectionList.forEach((s) => navIO?.observe(s));

    // Progress bars
    let progIO = null;
    if (prefersReduced) {
      progressCards?.forEach((en) => {
        const p = en.getAttribute("data-progress") || "45";
        const bar = en.querySelector(".progress i");
        if (bar) bar.style.setProperty("--p", `${p}%`);
      });
    } else if (progressCards && progressCards.length) {
      progIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const p = en.target.getAttribute("data-progress") || "45";
            const bar = en.target.querySelector(".progress i");
            if (bar) bar.style.setProperty("--p", `${p}%`);
            progIO.unobserve(en.target);
          });
        },
        { threshold: 0.25 }
      );
      progressCards.forEach((c) => progIO?.observe(c));
    }

    // Roadmap mini progress
    let roadIO = null;
    if (prefersReduced) {
      roadItems?.forEach((en) => {
        const p = en.getAttribute("data-rp") || "30";
        const bar = en.querySelector(".miniProgress i");
        if (bar) bar.style.setProperty("--rp", `${p}%`);
      });
    } else if (roadItems && roadItems.length) {
      roadIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const p = en.target.getAttribute("data-rp") || "30";
            const bar = en.target.querySelector(".miniProgress i");
            if (bar) bar.style.setProperty("--rp", `${p}%`);
            roadIO.unobserve(en.target);
          });
        },
        { threshold: 0.25 }
      );
      roadItems.forEach((i) => roadIO?.observe(i));
    }

    // Counters
    let countIO = null;
    if (prefersReduced) {
      counters?.forEach((el) => {
        const to = parseInt(el.getAttribute("data-count"), 10) || 0;
        const suffix = el.textContent.includes("%") ? "%" : "+";
        el.textContent = `${to}${suffix}`;
      });
    } else if (counters && counters.length) {
      countIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target;
            const to = parseInt(el.getAttribute("data-count"), 10) || 0;
            const suffix = el.textContent.includes("%") ? "%" : "+";
            const dur = 900;
            const t0 = performance.now();
            const tick = (t) => {
              const p = Math.min(1, (t - t0) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              const val = Math.round(to * eased);
              el.textContent = `${val}${suffix}`;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countIO.unobserve(el);
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((c) => countIO?.observe(c));
    }

    // Card spotlight
    const onCardMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      e.currentTarget.style.setProperty("--mx", `${mx}%`);
      e.currentTarget.style.setProperty("--my", `${my}%`);
    };
    cardList.forEach((c) => c.addEventListener("pointermove", onCardMove));

    // Arsenal filters
    const chipHandlers = new Map();
    const onChipClick = (chip) => {
      chipList.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.getAttribute("data-filter");
      toolList.forEach((t) => {
        const cat = t.getAttribute("data-cat");
        const show = f === "all" || cat === f;
        t.classList.toggle("hide", !show);
      });
    };
    chipList.forEach((chip) => {
      const handler = () => onChipClick(chip);
      chipHandlers.set(chip, handler);
      chip.addEventListener("click", handler);
    });

    // Case study modal
    const COLLAPSIBLE_SECTIONS = [
      "Key Design Decisions",
      "What Was Intentionally Not Automated",
      "Operational Readiness",
    ];

    const renderDetailSections = (node) => {
      if (!node) return "";
      const blocks = [];
      if (node.why) {
        blocks.push(
          `<div style="display:flex; flex-direction:column; gap:6px;">
            <div style="font:700 11px/1.4 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(233,233,241,.7);">Why this exists</div>
            <p style="margin:0; color: rgba(233,233,241,.85); line-height:1.6;">${node.why}</p>
          </div>`
        );
      }
      const listBlock = (label, items) =>
        `<div style="display:flex; flex-direction:column; gap:6px;">
          <div style="font:700 11px/1.4 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(233,233,241,.7);">${label}</div>
          <ul class="csList" style="margin:0; padding-left:18px; line-height:1.7; color:rgba(233,233,241,.8);">${items
            .map((i) => `<li>${i}</li>`)
            .join("")}</ul>
        </div>`;
      if (node.how?.length) blocks.push(listBlock("How it works", node.how));
      if (node.decisions?.length)
        blocks.push(listBlock("Key design decisions", node.decisions));
      if (node.notAutomated?.length)
        blocks.push(
          listBlock("What I chose NOT to automate", node.notAutomated)
        );
      if (node.production?.length)
        blocks.push(listBlock("Production considerations", node.production));
      if (!blocks.length) return "";
      return `<div style="display:flex; flex-direction:column; gap:12px;">
        <div style="font-weight:700; color: rgba(255,255,255,.92); font-size:14px;">${
          node.title || ""
        }</div>
        ${blocks.join("")}
      </div>`;
    };

    const renderDesignRationale = (diagramKey, titleLabel) => {
      const config = DIAGRAMS[diagramKey];
      if (!config) return "";
      if (diagramKey === "serviceops") {
        const dots = config.nodes
          .map(
            (
              node
            ) => `<button type="button" class="drDot" data-node-id="${node.id}" aria-label="${node.title}" style="
              position:absolute;
              left:${node.x}%;
              top:${node.y}%;
              width:12px;
              height:12px;
              transform:translate(-50%,-50%);
              border-radius:999px;
              background: linear-gradient(135deg,var(--accent),var(--accent3));
              box-shadow: 0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20);
              border:1px solid rgba(255,255,255,.16);
              cursor:pointer;
            ">
            </button>`
          )
          .join("");
        return `
          <p style="margin:0 0 10px; color: rgba(233,233,241,.72); line-height:1.6;">Responsibilities are separated to reduce blast radius and enforce operational correctness.</p>
          <div class="csArch" data-diagram="${diagramKey}" style="padding:14px; min-height:220px; background:
            radial-gradient(520px 220px at 18% 24%, rgba(255,42,109,.14), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
            border:1px solid rgba(255,255,255,.12);">
            <div class="wire" aria-hidden="true"></div>
            <div class="drMap" style="position:relative; width:100%; height:100%; min-height:180px;">
              ${dots}
            </div>
          </div>
        `;
      }
      const nodes = config.nodes
        .map(
          (
            node,
            idx
          ) => `<button type="button" class="drNode" data-idx="${idx}" role="tab" aria-selected="${
            idx === config.defaultIdx ? "true" : "false"
          }" style="border:1px solid rgba(255,255,255,.14); background:rgba(0,0,0,.22); color:rgba(233,233,241,.78); padding:10px 12px; border-radius:12px; display:flex; align-items:flex-start; gap:10px; width:100%; text-align:left; cursor:pointer; min-height:56px;">
            <span aria-hidden="true" style="width:10px; height:10px; border-radius:999px; background: linear-gradient(135deg,var(--accent),var(--accent3)); box-shadow: 0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20); flex-shrink:0; margin-top:4px;"></span>
            <span style="font-weight:600;">${node.title}</span>
          </button>`
        )
        .join("");

      return `
        <p style="margin:0 0 10px; color: rgba(233,233,241,.72); line-height:1.6;">Responsibilities are separated to reduce blast radius and enforce operational correctness.</p>
        <div class="csArch" data-diagram="${diagramKey}" style="padding:14px; min-height:auto; background:
          radial-gradient(520px 220px at 18% 24%, rgba(255,42,109,.14), transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          border:1px solid rgba(255,255,255,.12);">
          <div class="wire" aria-hidden="true"></div>
          <div class="drNodes" role="tablist" aria-label="${
            titleLabel || diagramKey
          } design rationale" style="position:relative; z-index:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
            ${nodes}
          </div>
          <div class="drDetail" data-detail style="position:relative; z-index:1; margin-top:12px; padding:12px 14px; border-radius:14px; border:1px solid rgba(255,255,255,.12); background: rgba(0,0,0,.26);"></div>
        </div>
      `;
    };

    const renderCase = (key) => {
      const data = CASES[key];
      if (!data || !csTitle || !csLead || !csMeta || !csRightSection) return;
      const modal = data.modal || {};
      const title = modal.title || data.title || "";
      const lead = modal.lead || data.summary || "";
      const metaTags = Array.isArray(data.meta) ? data.meta : [];
      const modalTags = Array.isArray(modal.tags) ? modal.tags : [];
      const tags = Array.from(
        new Map(
          [...metaTags, ...modalTags]
            .filter(Boolean)
            .map((t) => [String(t).toLowerCase(), String(t).trim()])
        ).values()
      );
      const sections = Array.isArray(modal.sections)
        ? modal.sections
        : Array.isArray(data.sections)
        ? data.sections
        : [];

      csTitle.textContent = title;
      csLead.textContent = lead;
      csMeta.innerHTML = tags.map((t) => `<span class="pill">${t}</span>`).join("");

      const filteredSections = Array.isArray(sections)
        ? sections.filter((sec) => ((sec && sec.h) || "").toLowerCase() !== "project basics")
        : [];
      const sanitizedSections = Array.isArray(filteredSections)
        ? filteredSections.filter(Boolean)
        : [];
      const html = sanitizedSections
        .map((sec) => {
          const listItems = Array.isArray(sec.list) ? sec.list : [];
          const list =
            listItems.length > 0
              ? `<ul class="csList">${listItems.map((i) => `<li>${i}</li>`).join("")}</ul>`
              : "";
          const diagram =
            sec.diagram && DIAGRAMS[sec.diagram]
              ? renderDesignRationale(sec.diagram, data.title)
              : "";
          const arch = sec.arch
            ? `<div class="csArch" aria-hidden="true">
            <div class="wire"></div>
            <div class="node" style="left:12%; top:40%"></div>
            <div class="node" style="left:34%; top:26%"></div>
            <div class="node" style="left:56%; top:58%"></div>
            <div class="node" style="left:78%; top:34%"></div>
            <div class="node" style="left:86%; top:60%"></div>
          </div>`
            : "";
          const body = `${
            sec.p ? `<p>${sec.p}</p>` : ""
          }${list}${arch}${diagram}`;
          const isCollapsible = COLLAPSIBLE_SECTIONS.includes(sec.h);
          const toggle =
            isCollapsible &&
            `<button class="ghostLink csToggle" data-state="collapsed" aria-expanded="false" style="padding:6px 10px; font-size:11px;">Show details</button>`;
          return `<div class="csSection">
            <div class="csSectionHead"${
              isCollapsible ? ' data-collapsible="true"' : ""
            }>
              <h4>${sec.h}</h4>
              ${toggle || ""}
            </div>
            <div class="csSectionBody"${
              isCollapsible ? ' style="display:none;"' : ""
            }>
              ${body}
            </div>
          </div>`;
        })
        .join("");
      csRightSection.innerHTML = html;
      csRightSection.scrollTop = 0;
      setPopoverData(null);
      popoverAnchorRef.current = null;

      const initDesignRationale = () => {
        const diagrams = Array.from(
          csRightSection.querySelectorAll("[data-diagram]")
        );
        diagrams.forEach((diagramEl) => {
          const key = diagramEl.getAttribute("data-diagram");
          const cfg = DIAGRAMS[key];
          if (!cfg) return;
          if (key === "serviceops") {
            const nodesEls = Array.from(
              diagramEl.querySelectorAll("[data-node-id]")
            );
            if (!nodesEls.length) return;
            if (prefersReduced) {
              nodesEls.forEach((n) => {
                n.style.transition = "none";
              });
            }
            const hoverNone =
              typeof window !== "undefined" &&
              window.matchMedia &&
              window.matchMedia("(hover: none)").matches;
            let pinnedId = null;
            const setActive = (id) => {
              nodesEls.forEach((node) => {
                const isActive = node.getAttribute("data-node-id") === id;
                node.setAttribute("data-active", isActive ? "true" : "false");
                node.style.transform = isActive
                  ? "translate(-50%,-50%) scale(1.08)"
                  : "translate(-50%,-50%)";
                node.style.boxShadow = isActive
                  ? "0 0 0 8px rgba(255,42,109,.14), 0 26px 70px rgba(255,42,109,.30)"
                  : "0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20)";
                if (prefersReduced) {
                  node.style.transform = "translate(-50%,-50%)";
                  node.style.boxShadow =
                    "0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20)";
                }
              });
              if (!id) {
                setPopoverData(null);
                popoverAnchorRef.current = null;
                nodesEls.forEach((n) => n.removeAttribute("aria-describedby"));
                return;
              }
              const nodeData = cfg.nodes.find((n) => n.id === id);
              const nodeEl = nodesEls.find(
                (n) => n.getAttribute("data-node-id") === id
              );
              if (!nodeData || !nodeEl) return;
              nodesEls.forEach((n) => n.removeAttribute("aria-describedby"));
              nodeEl.setAttribute("aria-describedby", "node-popover");
              popoverAnchorRef.current = nodeEl;
              setPopoverData(nodeData);
            };
            if (window.__drOutside) window.__drOutside();
            const closeOnOutside = (e) => {
              if (!diagramEl.contains(e.target)) {
                pinnedId = null;
                setActive(null);
              }
            };
            document.addEventListener("click", closeOnOutside);
            window.__drOutside = () =>
              document.removeEventListener("click", closeOnOutside);
            nodesEls.forEach((node) => {
              const id = node.getAttribute("data-node-id");
              const onEnter = () => {
                if (!hoverNone && !pinnedId) setActive(id);
              };
              const onLeave = () => {
                if (!hoverNone && !pinnedId) setActive(null);
              };
              const onFocus = () => {
                pinnedId = id;
                setActive(id);
              };
              const onBlur = () => {
                if (pinnedId === id) {
                  pinnedId = null;
                  setActive(null);
                }
              };
              const onClick = (evt) => {
                evt.stopPropagation();
                if (pinnedId === id) {
                  pinnedId = null;
                  setActive(null);
                } else {
                  pinnedId = id;
                  setActive(id);
                }
              };
              const onKey = (evt) => {
                if (evt.key === "Enter" || evt.key === " ") {
                  evt.preventDefault();
                  if (pinnedId === id) {
                    pinnedId = null;
                    setActive(null);
                  } else {
                    pinnedId = id;
                    setActive(id);
                  }
                }
                if (evt.key === "Escape") {
                  pinnedId = null;
                  setActive(null);
                }
              };
              node.addEventListener("mouseenter", onEnter);
              node.addEventListener("mouseleave", onLeave);
              node.addEventListener("focus", onFocus);
              node.addEventListener("blur", onBlur);
              node.addEventListener("click", onClick);
              node.addEventListener("keydown", onKey);
              node._handlers = {
                onEnter,
                onLeave,
                onClick,
                onKey,
                onFocus,
                onBlur,
              };
            });
            diagramEl.addEventListener("mouseleave", () => {
              if (!hoverNone && !pinnedId) setActive(null);
            });
            diagramEl.addEventListener("keydown", (e) => {
              if (e.key === "Escape") {
                pinnedId = null;
                setActive(null);
              }
            });
            setActive(null);
          } else {
            const detail = diagramEl.querySelector("[data-detail]");
            const buttons = Array.from(
              diagramEl.querySelectorAll("[data-idx]")
            );
            if (!detail || !buttons.length) return;
            if (prefersReduced) {
              diagramEl.style.transition = "none";
              detail.style.transition = "none";
            }
            const applyActive = (idx) => {
              buttons.forEach((btn, i) => {
                const active = i === idx;
                btn.setAttribute("aria-selected", active ? "true" : "false");
                btn.setAttribute("data-active", active ? "true" : "false");
                btn.style.borderColor = active
                  ? "rgba(255,42,109,.38)"
                  : "rgba(255,255,255,.14)";
                btn.style.background = active
                  ? "rgba(255,42,109,.12)"
                  : "rgba(0,0,0,.22)";
              });
              const node = cfg.nodes[idx];
              if (!node || !detail) return;
              detail.innerHTML = renderDetailSections(node);
            };
            const setActive = (idx) => applyActive(idx);
            buttons.forEach((btn, idx) => {
              if (prefersReduced) btn.style.transition = "none";
              const onActivate = () => setActive(idx);
              const onKey = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(idx);
                }
              };
              btn.addEventListener("click", onActivate);
              btn.addEventListener("keydown", onKey);
            });
            setActive(
              typeof cfg.defaultIdx === "number" && cfg.defaultIdx !== null
                ? cfg.defaultIdx
                : 0
            );
          }
        });
      };

      const toggles = csRightSection.querySelectorAll(".csToggle");
      toggles.forEach((btn) => {
        const sec = btn.closest(".csSection");
        const body = sec?.querySelector(".csSectionBody");
        if (!body) return;
        const setState = (expanded) => {
          body.style.display = expanded ? "" : "none";
          btn.textContent = expanded ? "Hide details" : "Show details";
          btn.setAttribute("aria-expanded", expanded);
          btn.setAttribute("data-state", expanded ? "expanded" : "collapsed");
        };
        setState(false);
        const handler = () =>
          setState(btn.getAttribute("data-state") === "collapsed");
        btn.addEventListener("click", handler);
        btn._handler = handler;
      });

      initDesignRationale();
    };

    const openCaseStudy = (key) => {
      renderCase(key);
      csModal?.classList.add("open");
      csModal?.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeCaseStudy = () => {
      csModal?.classList.remove("open");
      csModal?.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    window.openCaseStudy = openCaseStudy;
    window.closeCaseStudy = closeCaseStudy;

    const onModalClick = (e) => {
      if (e.target === csModal) closeCaseStudy();
    };
    csModal?.addEventListener("click", onModalClick);

    const panelKeys = [
      "serviceops",
      "schoolos",
      "umare",
      "hyperflow",
      "cortex",
      "gbp",
    ];
    const liveLinks = {
      serviceops: "https://serviceops.pro/",
      schoolos: "https://ai-school-os.vercel.app/",
    };
    panels?.forEach((panel, idx) => {
      const key = panelKeys[idx];
      const handler = () => openCaseStudy(key);
      panel.addEventListener("click", handler);
      panel.dataset.caseKey = key;
      panel.__handler = handler;

      // De-duplicate meta rows if they were rendered twice for a panel
      const metas = panel.querySelectorAll(".meta");
      if (metas.length > 1) {
        metas.forEach((metaEl, metaIdx) => {
          if (metaIdx > 0) metaEl.remove();
        });
      }

      const liveLink = liveLinks[key];
      if (liveLink && !panel.querySelector(".panelActions")) {
        const actions = document.createElement("div");
        actions.className = "panelActions";
        actions.innerHTML = `<a class="ghostLink" href="${liveLink}" target="_blank" rel="noreferrer noopener" aria-label="Open ${key} live demo">Live Demo -></a>`;
        const bullets = panel.querySelector(".bullets");
        if (bullets) bullets.insertAdjacentElement("afterend", actions);
      }
    });

    // Escape handling
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        if (csModal?.classList.contains("open")) closeCaseStudy();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Ensure modal layers reset on initial render
    if (!prefersReduced) {
      csRightSection?.scrollTo(0, 0);
    }

    return () => {
      drawer?.removeEventListener("click", onDrawerOverlay);
      menuBtn?.removeEventListener("click", openDrawer);
      drawerLinks?.forEach((el) =>
        el.removeEventListener("click", closeDrawer)
      );
      navIO?.disconnect();
      progIO?.disconnect();
      roadIO?.disconnect();
      countIO?.disconnect();
      cards?.forEach((c) => c.removeEventListener("pointermove", onCardMove));
      chipList.forEach((chip) => {
        const handler = chipHandlers.get(chip);
        if (handler) chip.removeEventListener("click", handler);
      });
      panels?.forEach((panel) => {
        if (panel.__handler)
          panel.removeEventListener("click", panel.__handler);
      });
      csModal?.removeEventListener("click", onModalClick);
      window.removeEventListener("keydown", onKeyDown);
      if (window.__drOutside) window.__drOutside();
      document.body.style.overflow = "";
    };
  }, [nodes]);

  return (
    <>
      <QweMarkup ref={rootRef} />
      <NodePopover
        open={!!popoverData}
        nodeRef={popoverAnchorRef}
        data={popoverData}
        onClose={() => {
          setPopoverData(null);
          popoverAnchorRef.current = null;
        }}
      />
    </>
  );
}

function App() {
  const isResumeRoute =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/resume");
  return isResumeRoute ? <ResumePage /> : <MainApp />;
}

export default App;
