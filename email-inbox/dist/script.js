/* Data (all 4 emails) */
const artistsAndPiecesData = [
  {
    id: 1,
    name: "John Artist",
    email: "j.artist@example.com",
    subject: "Submission: Metropolis",
    bodyText:
      "Hi there,\n\nPlease find my submission, 'Metropolis', attached for your consideration.\n\nThanks,\nJohn",
    pieces: [
      {
        id: "p1",
        title: "Metropolis",
        medium: "Oil on Canvas",
        price: "$1,800",
        dimensions: '12" x 16"',
        image: "https://placehold.co/600x400/000000/FFF?text=Metropolis",
        filename: "Metropolis_Final.jpg",
        filesize: "2.1 MB"
      }
    ],
    painPoint: "",
    issueField: []
  },
  {
    id: 2,
    name: "Jane Creates",
    email: "jane.c@example.com",
    subject: "Art for the show!",
    bodyText:
      "Hello!\nSo excited for the upcoming show! Here are my two pieces. I hope the files aren't too big, my camera exports them at a really high quality.\n\nBest,\nJane",
    pieces: [
      {
        id: "p2",
        title: "Sunset Over Water",
        medium: "Acrylic",
        price: "$1,200",
        dimensions: '48" x 36"',
        image: "https://placehold.co/600x400/E693A1/FFF?text=Sunset",
        filename: "IMG_8812.jpg",
        filesize: "14.8 MB"
      },
      {
        id: "p3",
        title: "Forest Light",
        medium: "Acrylic on Canvas",
        price: "$950",
        dimensions: '24" x 24"',
        image: "https://placehold.co/600x400/38A169/FFF?text=Forest",
        filename: "forest_pic.jpg",
        filesize: "8.2 MB"
      }
    ],
    painPoint:
      "Massive File Size: Files over 5MB can cause storage issues and need to be manually compressed.",
    issueField: ["filesize"]
  },
  {
    id: 3,
    name: "A. Nother Artist",
    email: "another@example.com",
    subject: "Artwork Submission",
    bodyText:
      "To whom it may concern,\nMy work, 'Untitled #3', is attached. Details below.\n\nTitle: Untitled #3\nMedium: Mixed Media\nDimensions: 61cm x 61cm\nPrice: €2,300",
    pieces: [
      {
        id: "p4",
        title: "Untitled #3",
        medium: "Mixed Media",
        price: "€2,300",
        dimensions: "61cm x 61cm",
        image: "https://placehold.co/600x400/5A67D8/FFF?text=Abstract",
        filename: "art.jpg",
        filesize: "1.1 MB"
      }
    ],
    painPoint:
      "Inconsistent Units: Price in Euros and dimensions in cm requires manual conversion.",
    issueField: ["price", "dimensions"]
  },
  {
    id: 4,
    name: "Sam Jones",
    email: "sam.jones@example.com",
    subject: "Submissions",
    bodyText:
      "Hi,\nI'm submitting two pieces. I've attached the image for 'Lone Tree', but I seem to have misplaced the file for 'The Path'. Can you let me know if you need it?\n\n-Sam",
    pieces: [
      {
        id: "p5",
        title: "The Path",
        medium: "Giclée Print",
        price: "Inquire",
        dimensions: "16x20",
        image: "",
        filename: "[No Attachment]",
        filesize: ""
      },
      {
        id: "p8",
        title: "Lone Tree",
        medium: "Giclée Print",
        price: "$450",
        dimensions: "8x10",
        image: "https://placehold.co/600x400/A0AEC0/FFF?text=Tree",
        filename: "tree.jpg",
        filesize: "3.1 MB"
      }
    ],
    painPoint:
      "Missing Image: No image was attached for one piece, requiring an email follow-up.",
    issueField: ["image"]
  }
];

/* Inbox animation logic */
document.addEventListener("DOMContentLoaded", () => {
  const diagram = document.getElementById("interactive-diagram-1");
  if (!diagram) return;

  const inboxList = diagram.querySelector('[data-field="inbox-list"]');
  const contentPane = diagram.querySelector('[data-field="inbox-content-pane"]');

  function cleanedBody(text) {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/^\s*\n+/, "")
      .replace(/^([^\n]+)\n*/, "$1\n\n")
      .trimEnd()
      .replace(/\n\s*\n/g, "\n\n");
  }

  function hasFilesizeIssue(piece, artist) {
    if (!artist.issueField.includes("filesize")) return false;
    const m = /([\d.]+)\s*MB$/i.exec(piece.filesize || "");
    return m ? parseFloat(m[1]) > 5 : false;
  }

  function getEmailHTML(artist) {
    if (!artist) {
      return `
        <div class="p-8 text-center text-gray-500 h-full flex items-center justify-center">
          Select an email to read it.
        </div>`;
    }

    const attachments = artist.pieces
      .map((p) => {
        const highlight =
          (artist.issueField.includes("image") && !p.image) ||
          hasFilesizeIssue(p, artist)
            ? "issue-highlight"
            : "";

        const image = p.image
          ? `<img src="${p.image}" class="w-12 h-12 rounded object-cover border border-gray-200"
               onerror="this.onerror=null;this.src='https://placehold.co/100x100/EEE/333?text=Error';">`
          : `<div class="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </div>`;

        return `
          <div class="border border-gray-200 rounded-lg p-3 flex items-center gap-3 ${highlight}">
            <div class="flex-shrink-0">${image}</div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-semibold truncate">${p.filename || "Missing File"}</p>
              <p class="text-xs text-gray-500">${p.filesize || "N/A"}</p>
            </div>
          </div>`;
      })
      .join("");

    const status = artist.painPoint
      ? `<div class="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md mb-4">
           <strong>Manual Work Required:</strong> ${artist.painPoint}
         </div>`
      : `<div class="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4">
           <strong>Status:</strong> No obvious issues found.
         </div>`;

    return `
      <div class="flex flex-col h-full">
        <div class="p-4 border-b border-gray-200 flex-shrink-0">
          <p class="text-sm">
            <span class="font-semibold text-gray-500 w-16 inline-block">From:</span> ${artist.name}
          </p>
          <p class="text-sm">
            <span class="font-semibold text-gray-500 w-16 inline-block">Subject:</span>
            <span class="font-semibold">${artist.subject}</span>
          </p>
        </div>
        <div class="flex-grow overflow-y-auto">
          <div class="p-4 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">${cleanedBody(artist.bodyText)}</div>
          <div class="p-4 pt-0">
            ${status}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${attachments}
            </div>
          </div>
        </div>
      </div>`;
  }

  function handleClick(id, el) {
    const isMobile = window.innerWidth < 768;
    const wasActive = el.classList.contains("is-active");

    // Collapse others
    inboxList.querySelectorAll(".email-preview").forEach((e) => {
      if (e !== el) e.classList.remove("is-active", "is-expanded");
    });

    // Toggle current
    el.classList.toggle("is-active", !wasActive);
    if (isMobile) el.classList.toggle("is-expanded", !wasActive);

    // Render desktop content
    if (!isMobile) {
      const artist = artistsAndPiecesData.find((a) => a.id == id);
      const isActive = el.classList.contains("is-active");
      contentPane.innerHTML = getEmailHTML(isActive ? artist : null);
    }
  }

  // Build list
  inboxList.innerHTML = "";
  artistsAndPiecesData.forEach((artist) => {
    const el = document.createElement("div");
    el.className = "email-preview border-b border-gray-200";
    el.dataset.id = artist.id;

    el.innerHTML = `
      <div class="email-preview-header relative p-4 pl-8 ${artist.painPoint ? "has-issue-dot" : ""}">
        <p class="font-semibold text-sm truncate">${artist.name}</p>
        <p class="text-sm truncate">${artist.subject}</p>
        <p class="text-xs text-gray-500 truncate">${artist.bodyText.trim().split("\n")[0]}</p>
      </div>
      <div class="inbox-mobile-content md:hidden">
        <div>${getEmailHTML(artist)}</div>
      </div>
    `;

    el.querySelector(".email-preview-header").addEventListener("click", () =>
      handleClick(artist.id, el)
    );
    inboxList.appendChild(el);
  });

  // Default select first on desktop
  const first = inboxList.querySelector(".email-preview");
  if (first && window.innerWidth >= 768) {
    handleClick(first.dataset.id, first);
  } else {
    contentPane.innerHTML = getEmailHTML(null);
  }
});